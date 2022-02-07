using System.Globalization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Yngdieng.Common;
using Yngdieng.Protos;
using ZingzeuOrg.Yngdieng.Web.Db;
using ZingzeuOrg.Yngdieng.Web.Services.Frontend;
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


    [HttpGet]
    [Route("speak/{wordName}/refresh")]
    public async Task<IActionResult> RefreshCorpusDataForWord(string wordName)
    { }

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
            var word = await _dbContext.Words.Where(w => w.WordId == wordId).SingleOrDefaultAsync();
            // TODO: if not found, default to tts
            if (word.PreferredCorpusUtteranceId == null)
            {
                var res = await _corpusService.GetBestUtteranceForWordAsync(new GetBestUtteranceForWordRequest
                {
                    wordId = docRef.ZingzeuId
                });

            }
            word.PreferredCorpusUtteranceId
        }


        // var preferredSandhiYngping = 
        //     (await Words.GetWord(_indexHolder, _dbContext, new NoOpZhConverter(), docRef))
        //         .Pronunciations.First;
        // if (word == null)
        // {
        //     return NotFound();
        // }
        // word.
    }
}