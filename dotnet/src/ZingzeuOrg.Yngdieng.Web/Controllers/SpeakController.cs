using System.Globalization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Yngdieng.Common;
using Yngdieng.Protos;
using ZingzeuOrg.Yngdieng.Web.Db;
using ZingzeuOrg.Yngdieng.Web.Services.Frontend;
using ZingzeuOrg.Corpus.Protos.Internal.V1;
using static ZingzeuOrg.Corpus.Protos.Internal.V1.CorpusService;

namespace ZingzeuOrg.Yngdieng.Web.Controllers;

/// <summary>
/// Speak API. 和TTS API 相比，Speak API更为高层.
/// </summary>
[EnableCors("AllowAll")]
public sealed class SpeakController : Controller
{
    private readonly ILogger<SpeakController> _logger;
    private readonly AdminContext _dbContext;
    private readonly CorpusServiceClient _corpusService;
    private readonly IIndexHolder _indexHolder;

    public SpeakController(
        ILogger<SpeakController> logger,
        AdminContext dbContext,
        CorpusServiceClient corpusService,
        IIndexHolder indexHolder)
    {
        _logger = logger;
        _dbContext = dbContext;
        _corpusService = corpusService;
        _indexHolder = indexHolder;
    }

    [Route("speak/{wordName}")]
    public async Task<IActionResult> SpeakWord(string wordName)
    {
        var docId = ResourceNames.ToDocId(wordName);
        DocRef docRef;
        try
        {
            docRef = DocRefs.Decode(docId);
        }
        catch (Exception e)
        {
            return BadRequest($"{docId} is invalid");
        }

        if (!string.IsNullOrEmpty(docRef.ZingzeuId))
        {
            var wordId = int.Parse(docRef.ZingzeuId, NumberStyles.HexNumber);
            var maybeUtterancePreviewUrl = await GetUtteranceFromCorpus(wordId);
            if (!string.IsNullOrEmpty(maybeUtterancePreviewUrl))
            {
                return RedirectPermanent(maybeUtterancePreviewUrl!);
            }
        }

        var preferredTtsUrl =
            (await Words.GetWord(_indexHolder, _dbContext, new NoOpZhConverter(), docRef, Words.Mode.Snippet))
                 .Pronunciations
                 .FirstOrDefault()
                 ?.Audio
                 .RemoteUrls
                 .RemoteUrls_
                 .FirstOrDefault();
        if (preferredTtsUrl == null)
        {
            return NotFound();
        }
        return RedirectPermanent(preferredTtsUrl!);
    }

    [HttpGet]
    [Route("speak/{wordName}/refresh")]
    public async Task<IActionResult> RefreshCorpusDataForWord(string wordName)
    {
        var docId = ResourceNames.ToDocId(wordName);
        DocRef docRef;
        try
        {
            docRef = DocRefs.Decode(docId);
        }
        catch (Exception e)
        {
            return BadRequest($"{docId} is invalid");
        }

        if (string.IsNullOrEmpty(docRef.ZingzeuId))
        {
            return NotFound();
        }

        var wordId = int.Parse(docRef.ZingzeuId, NumberStyles.HexNumber);
        var word = await _dbContext.Words.Where(w => w.WordId == wordId).SingleOrDefaultAsync();
        if (word == null)
        {
            return NotFound();
        }
        await FetchAndStorePreferredCorpusUtterance(word);
        return Ok();
    }

    private async Task<string?> GetUtteranceFromCorpus(int dbWordId)
    {
        var word = await _dbContext.Words.Where(w => w.WordId == dbWordId).SingleOrDefaultAsync();
        if (word == null)
        {
            return null;
        }
        if (word.PreferredCorpusUtteranceId == null)
        {
            try
            {
                await FetchAndStorePreferredCorpusUtterance(word);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error trying to fetch utterance from corpus for {0}, falling back to TTS", docRef.ZingzeuId);
            }
        }
        if (string.IsNullOrEmpty(word.PreferredCorpusUtterancePreviewUrl))
        {
            return null;
        }
        return word.PreferredCorpusUtterancePreviewUrl;
    }

    private async Task FetchAndStorePreferredCorpusUtterance(Word word)
    {
        var zingzeuIdHex = ResourceNames.ToZingzeuIdHex(word.WordId);
        var res = await _corpusService.GetBestUtteranceForWordAsync(
            new GetBestUtteranceForWordRequest
            {
                ZingzeuId = zingzeuIdHex
            });
        _logger.LogInformation("Fetched utterance for {0}: {1}", zingzeuIdHex, res.Utterance?.Name ?? "N/A");
        if (!string.IsNullOrEmpty(res.Utterance?.PreviewUrl))
        {
            word.PreferredCorpusUtteranceId = res.Utterance.Name;
            word.PreferredCorpusUtterancePreviewUrl = res.Utterance.PreviewUrl;
        }
        else
        {
            word.PreferredCorpusUtteranceId = string.Empty;
            word.PreferredCorpusUtterancePreviewUrl = string.Empty;
        }
        await _dbContext.SaveChangesAsync();
    }
}