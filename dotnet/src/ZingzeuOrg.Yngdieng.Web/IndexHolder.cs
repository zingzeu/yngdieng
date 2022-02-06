using Lucene.Net.Index;
using Lucene.Net.QueryParsers.Classic;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Yngdieng.Protos;

namespace ZingzeuOrg.Yngdieng.Web
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
