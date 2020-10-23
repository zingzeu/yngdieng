using System.Collections.Generic;
using System.Linq;

namespace Yngdieng.Backend.Services.Admin
{
    internal static class EnumConversions
    {
        internal static Dictionary<Yngdieng.Admin.V1.Protos.SandhiCategory, Db.SandhiCategory>
           ProtoSCToDbSC = new Dictionary<Yngdieng.Admin.V1.Protos.SandhiCategory, Db.SandhiCategory>() {
                {Yngdieng.Admin.V1.Protos.SandhiCategory.Unspecified ,Db.SandhiCategory.UNSPECIFIED},
                {Yngdieng.Admin.V1.Protos.SandhiCategory.Bengzi ,Db.SandhiCategory.BENGZI},
                {Yngdieng.Admin.V1.Protos.SandhiCategory.Sandhi ,Db.SandhiCategory.SANDHI},
           };

        internal static Dictionary<Db.SandhiCategory, Yngdieng.Admin.V1.Protos.SandhiCategory>
        DbSCToProtoSC = ProtoSCToDbSC.ToDictionary(x => x.Value, x => x.Key);

        internal static Dictionary<Yngdieng.Admin.V1.Protos.Variant, Db.Variant>
                   ProtoVariantToDbVariant = new Dictionary<Yngdieng.Admin.V1.Protos.Variant, Db.Variant>() {
                {Yngdieng.Admin.V1.Protos.Variant.Unspecified ,Db.Variant.UNSPECIFIED},
                {Yngdieng.Admin.V1.Protos.Variant.FuzhouCity ,Db.Variant.FUZHOU_CITY},
                {Yngdieng.Admin.V1.Protos.Variant.Lianjiang ,Db.Variant.LIANJIANG},
                {Yngdieng.Admin.V1.Protos.Variant.Cikling ,Db.Variant.CIKLING},
                   };
        internal static Dictionary<Db.Variant, Yngdieng.Admin.V1.Protos.Variant>
        DbVariantToProtoVariant = ProtoVariantToDbVariant.ToDictionary(x => x.Value, x => x.Key);

    }
}
