using Yngdieng.Protos;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Lucene.Net.QueryParsers.Classic;
namespace Yngdieng.Backend
{
  public interface IIndexHolder
  {
    void StoreIndex(YngdiengIndex index);
    YngdiengIndex GetIndex();

    IndexSearcher LuceneIndexSearcher { get; set; }

  }

  public sealed class IndexHolder : IIndexHolder
  {
    private YngdiengIndex index = new YngdiengIndex();
    public IndexSearcher? LuceneIndexSearcher { get; set; }

    public IndexHolder()
    {
    }

    public void StoreIndex(YngdiengIndex index)
    {
      this.index = index;
    }

    public YngdiengIndex GetIndex()
    {
      return index;
    }

  }
}
