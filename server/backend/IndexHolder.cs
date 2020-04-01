using Yngdieng.Protos;

namespace Yngdieng.Backend
{
  public interface IIndexHolder
  {
      void StoreIndex(YngdiengIndex index);
      YngdiengIndex GetIndex();
  }

  public sealed class IndexHolder : IIndexHolder
  {
      private YngdiengIndex index = new YngdiengIndex();

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
