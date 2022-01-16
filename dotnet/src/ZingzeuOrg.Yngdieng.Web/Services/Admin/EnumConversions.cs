using System.Collections.Generic;
using System.Linq;
using AdminProtos = Yngdieng.Admin.V1.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services.Admin
{
    internal static class EnumConversions
    {
        internal static Dictionary<AdminProtos.SandhiCategory, Db.SandhiCategory>
           ProtoSCToDbSC = new Dictionary<AdminProtos.SandhiCategory, Db.SandhiCategory>() {
                {AdminProtos.SandhiCategory.Unspecified ,Db.SandhiCategory.UNSPECIFIED},
                {AdminProtos.SandhiCategory.Bengzi ,Db.SandhiCategory.BENGZI},
                {AdminProtos.SandhiCategory.Sandhi ,Db.SandhiCategory.SANDHI},
           };

        internal static Dictionary<Db.SandhiCategory, AdminProtos.SandhiCategory>
        DbSCToProtoSC = ProtoSCToDbSC.ToDictionary(x => x.Value, x => x.Key);

        internal static Dictionary<AdminProtos.Variant, Db.Variant>
                   ProtoVariantToDbVariant = new Dictionary<AdminProtos.Variant, Db.Variant>() {
                {AdminProtos.Variant.Unspecified ,Db.Variant.UNSPECIFIED},
                {AdminProtos.Variant.FuzhouCity ,Db.Variant.FUZHOU_CITY},
                {AdminProtos.Variant.Lianjiang ,Db.Variant.LIANJIANG},
                {AdminProtos.Variant.Cikling ,Db.Variant.CIKLING},
                   };
        internal static Dictionary<Db.Variant, AdminProtos.Variant>
        DbVariantToProtoVariant = ProtoVariantToDbVariant.ToDictionary(x => x.Value, x => x.Key);

    }
}
