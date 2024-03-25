import React, { useEffect, useRef, useState } from "react";
import H from "@here/maps-api-for-javascript";

const MapComponent = (props) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const platform = useRef(null);
  const { restaurantPosition } = props;

  useEffect(() => {
    // Check if the map object has already been created
    if (!map.current) {
      // Create a platform object
      platform.current = new H.service.Platform({
        apikey: import.meta.env.VITE_API_KEY,
      });

      // Get user's location using Geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Create a new Raster Tile service instance
          const rasterTileService = platform.current.getRasterTileService({
            queryParams: {
              style: "explore.day",
              size: 512,
              lang: "en"
            },
          });

          // Creates a new instance of the H.service.rasterTile.Provider class
          // The class provides raster tiles for a given tile layer ID and pixel format
          const rasterTileProvider = new H.service.rasterTile.Provider(
            rasterTileService
          );
          const marker = new H.map.Marker({ lat: latitude, lng: longitude });

          // Create a new Tile layer with the Raster Tile provider
          const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);


          // Create a new map instance with the Tile layer and user's location
          const newMap = new H.Map(mapRef.current, rasterTileLayer, {
            pixelRatio: window.devicePixelRatio,
            center: { lat: latitude, lng: longitude }, // Center map at user's location
            zoom: 14,
          });

          // Add panning and zooming behavior to the map
          const behavior = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(newMap)
          );

          var polylineString =
            "BGoqzqzBoi2xwEwCoGgFwRoLgekrB0iEsE4NgFoQ8BoG4Ss7BokBk2DgF0PgF0P8GsT4Ioa8GwW0K8kBgFwR4N8uBwRgyB4DgK4DwHsEoLsOkhBsEsJgF8B0FkDsOkI4IsEoakN0K0F4N8GgFwCoL8GkIsEsYkN0F3NoGjS4I7asJ3ckN3mBkSz3BgKnfoGrT4DzKgFzPsEzPgF_OkDnL0F_T0FjSsE7QsEjDkDvCgFvC0F7BgFnB4DTsEnBsOjDoGvC8GvC4NjD8L7BkNvCsETkDT0KvCsOvCwH7B8f7GkNjDsY_EkDToV_EoazFwvBzK0evHA_EU7GoBnGoBrEwCzFkD_E4DrEgFrEgFvCsEnBsEnB0FT8GU0FoB0F8B0FwC4NvRgU7a0K_O4DzFwRzZ4DzFsOnV4N3S8GzKsJrO0PnV8Vze0FjIgK3N4DnG8G_JwCjDoQvWoQjX0P7VsO_T0FvH0KnQ0KrO0FjI4S7aoa7f4IvRoBrEoGU4NoBoGkD0K8BkN8BoL8BonCwMwHoBgZkDkhB0FsxBkIsEUoL8B4ckDkX4DkI8B8kBoG0FoB8GoB4I8BsJ8BsTsE0KwCoGoBgFoBwM7BoLAwHUgKoBgKnGsOrJoG_EsOvM4I_J8GrJsJrO8GnLkIzPwCnGoB7GUzFT7GT_EnBrEnBzF7BzFvCzFvCzFvHjS_Y31BrErJrEzKrEzKvMvb_ErOvCvHnB_EnBnGTnGAnGAzFArJoBjSgF7uB8G_jDoBzPoG3pCoBnQkDrnBwCzyBwCrd8B_Y0FrEUrT0F8B0FkD0PsEwW4DwHnBsJT41BjIgF7GwgB3DsYnB84BvCgKTwWnB4_B_EkS7B0KnB8GTwMA8GTopBjDoa7B8GTwMvCwHnB0KvC4I7BsJjDsJjDsJ3DoLrE8Q3I4N7G4I7Goa7QoQnL4S7L8LnG0FjDgF7BkInBkDTgKvC0P7B8aToLA4NAkNAoVAgKA8fnBg3B8BoLAoQT0jBU8VAwb8BkIA0UUoVT0UTwHA0ZA4NAgUT8aAkNAsToBkhBT4coBwRAgPAsToBwCUsJoBkc4DsYkD8L8BgUwCoakDopBkIkhB4Doa4D4mBoG8GoB0ZkD4IUoVwC0PkDkNkDoLwCoVkDgZ4D0U8BgeAgZA4IT8QvCsTnB8VnB4cvCgeTsEA0PA84BjD4XT8LA0FToQA8fnB4ITkcTgPTkNAkcAwHU8GUsJoBkI8BsJwCkIkDkIkDwM0F4NoG8VsJ8QwHsT4IsJ4D8L0F0KsEsdkNgP8GoLgFsE8B8QwHkNoG4I4DwRwHsOgFoLkD8G8BkI8BoGoB4I8BoGU0KoBoLUgKUsOAwHAwHT0PvCoLvC0FnBwH7BgKjDwMjD0KjD8LvC8f3IgKvC46BnQ0KjDsO3D8avHwMjD0KvCoLvCgK7Bge_E4XjD4InBwWvC0K7BwM7BgZ3D4mBnGsJnBkIT8L7B0PvC4NvC4c7GoV_E4S_EoVnGkwBjNgKvC4NjD4I7BsEnBsJ7BgU_EwgBrJwlB_JgyB3N4N3DkXnG0tBvMwM3D8G7BsdrJ0KvCoQrEsJvCwHnB4I7B0FnBwMvCwMvCkN7BwgBrE0P7BkS7B4NTkST4hBnBgjBnBsTTsOUgPUwMUkIUkN8BkSwC4c4DkN8BgoBoG0K8B8VwC4IoBoLU8LUsJAwHAsJTsJT4NT8LnBkSvC0U3DwMjDkSrE0P_EkIvC4crJoQzFwM3D0oBjNwRzFgUzFsJvCsJvCkS3D4InBoLnBoQ7B8QnBkSnBkNTgFAwMA8QT4rBnBsJTkNTkITwMTgPAoLA8LUkNoB4SwCsOwCwWkDgP8BkSwCkSAs2BgFokBwCoQ8Bsd8Bw5BsEsT8B4XoBsOA4SAgPT8LT4N7BwM7BopBzF0wCnLg8BjIwoC7LsiB3D4N7BwMAwMAkhBnBsOU0UT8VTkN7B0erE8L7BsJ7BoiCvM8zBnL0KjDkIvCgKjDwHvCsE7BsEvC0KrEwM7GsJ_EsJzFgKnGsOrJ0tBvbssB3ckmBrY8Q_J8GrE8LvHge_To2C31BwWrOwWrOkwB_d0tBrd8pBnakXrOouBrdofnVo9BjrBoa_T4rBzjBwb7VsTrOwWjSsiBvbkSrO8V7QwHnGkIzFgoBvgBwgB_YokB3coQ7L4X3S4NrJ0K7G0KzF0P3IgKzFkIrEwHrEoQ7G8L_EsOzFkIjDwH7B4iD7f4rBrO01Cna0F7B8G7B4IvC0mC3X0ZjIgU_EoG7BoL3DkcrJsJjDs7BvR4NrE8QzFsiBzKk1BrOoxC3XoG7BgF7BgkD7f4SzFokBnL8f_J8L3DkSzFgtB3N8zBnQ8Q_E4IjD4DnBwgB_J4NrEsOrEwW7GsJjDsJjDkcjI4SnGgmC7VgZjIsd3IghCzUoVnG8LrE8vDnkBk4CnagUrEoLvCgoBrJwR3DsdnGgK7BkhBnGgFTkDTsY7G0Z7GsJjDwgBjNsJ3Dwb7LwH_EgoBjXgP3I8azP4wB7a0kDv5B0KzF8Q_JozB3ckI_EgUnLopBjXoLnGgFjD0KzFkhB_T8GrEwM7GgK_E0P3IsTzKof7LoV3DsdzKwM_E0FvCgFvCsTrJ4SjI0U3Ige7LkIjDgejNkmBzP8Q7GgoBjSs5CjmBofvM0tB_T0PnG4wBnVsxBzU4wBnV4XzKopBjSgtB7QwW3IwW3I0KrE8LzFkNnGoLnGgKnGgP_JgKjI0K3IkmBjhBs2BnuBgZ_T4XjS8B7B4DvC4S_OoLjIkS7LwMvHwH3D4IrEkI3DgF7B8VnGsJjDkN3D0FnB0KjDsJ7BsJnB4InBwCT0e_EkX3D0UrEwvB_Jw0BzKkwBrJsOjDkNvC0PjD0UjDgUvCkSvCkXnB0PT4SAgPAkIA8GUgKUsJUwMoBoLoB0KoBgKoBkmBoGkhB8GwgB0F0Z0FoLoBsOwCgZsEkc0F4IoB8G8BgUkDoV4D4DUkDUsJ8BkNkDsEU8Q4DsEUsOwC4SkDokBsE0KoBsOwCwMoBoGUwHUghC7B0oBrEgP7BwMvC0K7BoLvC0PrEkNjDsqCnV4X7GkcjIwbjIkrBrO0U3IoQvH4NnGgZjN8QrJ0e7Q8Q3IopB7V0P7G8QvHgK_EkN_EkN3D8L3D0U_EgKvCsOvCgPvC8LnB8LnB0PnBoLTwRAsOoB0FA8V8BkSwC8VkDgU4DkcgF4S0FsOgF4NgFkN0F8LgFwHkDgK4DgUkIoV4I0ewM4X4IoGkDsd8LgoBkSkcsJkrB8QwlBgP8BUgyBsTge0KslC4Xw-B0UkXkIofsJ08B0PkmB0K0ZwHkhBsJ0jB0KwgBgKgZkI0egK4cgKoQgF8LgF4c4I4mBkNwR0FkwBgPkIwCwMkDgZ0F4rBgKwlB4IgUsEsO4DkNsEoawH4XkIwR0F4coLof0Ko-DsxB8G8B8GwCsxB4S82C8f4X4I4S8GsdoL8pBsOkS0F0ZwHgtBoLk_BsOgtBwH4csE0ZsEouBgFkNU0yBsEkc8B8LoBkXwCkIoB4kCoGoQoBkST4S3D4X7G0P_EwRnGsO7G4SzKof_T4crTwR7LwM3IkS3NwWrTkN7LsOrO0P7Q8kBnpBoG7GgP7QwH3IgjBzoB4cvgB4I_JoG7G8L3NsOvR8uB31B8pBjwB0e3mBkIzKgjBzyB8L7QwM3SgK7Qsd_xB4mBniC4crxBoV7kB8QvboGrJwC_EsT_iB4I3NoQ7agUvgB8LvRoQnasJ_OkN_TkkCvmD8V7f4X_iBsT_Y8GzKsTnawR_YgyB7iC0U3c4X7fsYriBwHzKkc7kB0K_OwHzKkSvb4hB_xBkIzKkIzK4I_JkI3I0KrJoLjI4S3NkmB_Y4mB7aknD_qC4uCn4BstDnsC0tB7f4S3N0U7QkN7L0KrJ0KnL4N_OkuCr5C0Z_dwgB7kB0KvMgK_J8G3IsE_EgU3XsT_T4NnQkIrJoGvHoGvHkIrJkXnasiB3hB8ajcoVrY4I_J0K7L4N_OoQ3SoazegKnLkXrYokBvlBwvBrxB0oB7pB0Z7a0Zna8GvH8QjSsdjc4NvMkI7GkNvM4XrT8Q3NgKrJ0U7Q0UvR8avW8f7awMzKgPvMsJ3IgKvHsTvR8QvR4S_T8LnQ8QvWgK_OoLzUwMnawM_dgPrnB8L7fwM_iB8LvgB4IjXoG7QwR3wBsT36BkIzZgKnfgKrdgP7uBgF_OsErO0F7Q4I3c8G_Y4D7QgFzU4D3SgFzUkDvRwHrdkDrO8G3ckIzZwH_TwH3S0FzK0F7L8GnL8GnL4I_O4I_OkI3NwH3NkNnVsTzjBgej1BkmBzhCwW3mBoLzU8LzUkSnf8kBniCgP7a0UzjBge3wB0U_nB8VrnBsT3hBkhBj6B4IzPoV7kBgPrYkD_EkSrYoL_OoVnV4IjI4I7GwHzFkN3IkN3IgoB_T08BrY0UjIsiBvMkczK0yBrToLrEgenLgK3D03B_TokB_OwM_EoGvCgrC_d0PzFsOzF0yBrT8GjDoarJwgBjNkmB_O0KrEsTjIsT3IwWjN0FjDwWrO0UnQ4NzKwHnGsTrTwMjN4IrJkSvWoL_O0PvWwH3NoQ7a8L7aoLnasJ7akI3c4DrOwC7LoB7GkD3NwHzyBoBzP8B3NoB_OU7GwCzUsE_xBoBjIkD_dwCnVsE_iBgFzoB0Frd0FjX0F3S4D_JkDvH4DrJoBjDsJ7V8GvM4I_OgP3XsT3c0FjIsT_YkInLwH7LwqB36B4c_nBssBz8BwHrJ4I_J4IrJwMnLoanVgKvHsJnGgP3IkN7GsgC_d8LzF0uDjwBkI3DsY7LwbzK8GjD0iEj6BkpCvgBgmC7fwzE_gC0hCvgBwMvHsJ_E0KnG0ZnQ0KjIoLjIonC7uBgenV4mBjX8QrJ8L_EsOnGwMrEoL3DgKjD4XzFkNjDwMvCwqBvH89BnL4zCjS8L3DoL3D0U3IsJ_EwHrE0KnG08B3mBgKnGonCnuBgP_JoV3NsYnQ0jBvWkX_OsJnGwR7LsO_JgKvHkkCj6BokBrdwWzPgKzFsJrE4IrEsJ3D0KjDwHvC0KvCoL7B8LTsqC7BgZUwlBA0PAgPA8pBoBoVUkXU0UU41BrE0K7B0K7BsJvCoLjDoL3D0KrEkXzKsJ_EwHrEokB_YwWvRoQjNgoBnf8L_Jg3BjrB4uC79BgtBvlBopBvgBw5BnuBwHnGoQ3Ns2BjrB8V7Q4hB_YwMjIgUnL0PvHgUvHwRrEkczFgjBT8Q8B8QwC0KoBgZgFoVsE0ZsE0UkDoLoBwMUgUTsOnB0U3D8a7Gwb3IonC7V8L3DwM3DoVnGsxBzP41BzPg6CzewHvCo4G79B49H3pC4c3IokB_J89BvRsJjD4IjD4rBnQoL3DsOzFkNrE8LrEokBzPsnBjSwbjNo4BnaoiCze8L_E0KzFg3B_YokBvRgK3DkrBzUokB7Q8lDvvBshEz8Bo5D36B0P3Ik4CvvBsEvCoL_EwR_JkpCzoBoQ3IkgEnnC4mBnVkpCjmBoanLsOzFsnBjN0KvCoLvC0yB_Jg8B7LwbvHoLjD4I3DsJrEsT3I0KzFgKnGoQnLkXrTkIvHoLjNoLjNsiBnuBwHzKgP_TwHzKw-B72CsdvqB8V_dkDrE4hBrsBkNnQ8QvWsYjhBsY7foL3NwH3IkI3IwHvH4I3IkIvHsJjI4I7GwgBzZof3XgmCnzBo2Cv-BgKvH4N_J0K7G0KvHk6BvqBwgBvW4kCzyBwRjNgjBzZsxBnkBsEjDwWzPwlBvbkN_JoLrJkI7GwHvHoG7G8G3IoL7QoG3IgFvH4DnGoLvR0oBn9BwbzoBsnBn4BouBzhCgP7V0PnV0FjI8f7uBgPrYwMvWgF_J4DjIoGzPoG7Q4D_JgFrOoG_T4DjNsErO4DvMsdvhD8G7VoGzUwMvqB0UvjC8zB7mFwR36BkSrgC4IrdwC3IoG_TkNzoB4DnLkD_JsO_sBsEjSkDnQkDnQ8BrOUvMUzPTzPA3IT_JnB7LnB7LjDnLvC7LvCzK7B3IvCzK7BvH3DjS_EjSvCzUnB_OAnGAnGAnGU7GkDnLwC7GgFjNgKnQ4IvMwHzKgKvMgU_doQ3XgPzU0P7V0Uvb0Z7kBsTvbwHnLkX3hB0evvB0KrO0ZjmB8GrJkXriBsJjN0PjXgevqBoLnQkS_Y4X3hBwgB7uB4SnawR_Y8uBniCgPnVoGrJ4SnasJ7LwW3csO7QsJrJ4IrJ4IrJkI3Ioa_dsYzZgjBrnBo9BrlCsYnawRzUs7BjkC4cnf4rBv0BsiBnpBsYzeoQrTgZ_dokBjrBsTjXsYrdgKvM4I_JsO7Q0FnGoL3N8LzPoG3IopBjwB8a7fgUjXgZnf4rB7zBouB_2BsYjcgU3XgjBvqBoV_YsYrdsT7VgUvWwRvR8kB7kBsnB3mBk_BzhCwHrJsEzFkDrEkDrEkI_J4D7GoLrO4D7GkI3N0P7agKvRwHzPwM7a8V3wBoa36BoQ7kBwHnQsO3hBkS3mB0P3hBgKjXwHnQwH_ToGjS0F7QsE7QsEjSkD_O4D7QkD7QsJzyBoLj6B8BjNkDzP0F_dgFzUkDnL4DzKsEnLgF3N4IvR8L3S0FjIkIzK0KjN4I_JsJ_JsJ_J4SrTgK7L4I_J8G3IoGjIkInLwHjN0FzKgF_JkIrTgPvlBoQ_nB8LzesdzmCsnBz_C8f3uCwWr7BgK7V0FrO8LrdsgC3-E0Zj_BgKjXwHvRgF7LoG7LoG3N4IzPwHjNoL3SgZ_nB4IvMkIvMsO_YkI3N0KvRkXjmBoaztB0UzjBsdzyB0jBv-Bge31B0jB_7BonC3gEkXzoBsOzZoavvB4hBz8BgoBjpCsO_YoL3SgKzPsiBz8BkX3mBoV7kBkmB3_Boa_sBkNnV0KjS4IzPsO3XkNvWkcnuB4S7fwR_d8L_TkIjNoGzK4DvH0FvM8GvR0F_OwHzZ8L7pBkIrY4D_OoVr0CkIze4DzPsEzPoG7VgF_OgFrOwH3S0K_Y8kBr0C4N_dsJnV0K_YgtBnlDsJ7VwH_T8GzP0K_YgKrTsJnQgK_OwH7L8GrJsJvM8LrO0P3So9B_qC0PrTkNnQgKjNwHzK4I3N4I3NsJ7Q0KzU0KrT0KzUofr7BgZrxBoGnLo0DniHgUvlB4X7uBsT7kBoVzoBkX3rB0UrnBoanzB8LvW8B3D4DvHgU7fwgB36B4hBz8B0P3cgUnkBwbrxBkX7pBs7BnqDwbrxB08B3sD8LzU0PzZwHnL8G3I8V7a8LvMoQnQ0PrO8GnG4NjNgP3Ns0C3uCgFzFoL7L0KvMkNzP4N3SoL_OkNjSsEnG8G_J4IjNwMjS0P3X0wCv1D4I7LwH7LwqBv-Bo5DvxFkc7pBkkCrjDgyBvoCopBz8BoLvRgKjNgK_O4DzF8L7QkN_TgKzPkI3NoGnLoGvMsJ_TsJnVsgC30E4mBv3CgPriBgPriB0FjNoQzjBgK_YoVj1BwHrToG3N0F3NsEvMgF7Q0FzUgFze4DrTkD3SkDrT4D_d8B3SoBvRsEvlB8B3SoB7QwC3S4DjmBoBvMkD7VkDnQkD3SsEvW0FnVoG_YwHnfof37DgZrjD4NrgCkDnQwCvRwCvR8BnQoBvMoBrO8B7VsE_qCkSziJ8BjcwC3ckDriBkDrY4D7awC_O4DrTgPvtCkInpBwHzjB0jB3yF8B3IoBrJoBnGoBzFsEnVkD_TkDjS4DvWsJv-B0PjnD8G7uB0U7oEgPjiDgFvgB4D_YkD7VkD7akIztBgFnasErTgFvRgFrT4I3XgF3NwCzF8B_EwH_OkInQkI3NkI3NoL7QoL_O4NvRoLvMgK7LsJrJwRzPsY_T8Q7LsOrJwM7GsYvMsJrEkIjDgPnGwM3DoL3D4NjDsO3DsTjDgUjD0PnB4SA8VUsYoB8VoBwlBwC4SUkS8B8VoBgKUsOoB4c8Bg3B4DgoBkD4_BsE8aoBkSA0KUwWA8LUg3BnBwvBvCsTvC4NnB0KTwM7BsYjD0KjDgKvC0KjDwRzF4NzFgPnGoV_J0yBjckwBvbgU_J8VnLoQ7GgKrEsJjDgZ3I4SzF4S_E8anG41BrOkc3IoGvC0F7BoLvCwMzF8VrJ8Q3IoQrJkI_EkS7LsE3D0K7GkXjS4NnLgKrJoL_JkNjNkmBjrBkI_Jo2C7lDs2B3_B4rB7zBsEzF4DnGkI7LoGzKoLrTwHrOwHzPoLvWkSjmBgP_dkI7Q8G_O8G_O8B3DkXnuBwHrO8L3X0FnLoQ_iB0PnfgF_J8GnQ4rB_0CgF_J8LrYsOrdkI3SwHjS8GjSgFrO0FvRgF7Q4DnQ4DrTkD7QwCrOkD3XwCjS4D_YsEzjB4Nn2CkDjXwC_T8BjS4DjcsE3hBoL7xCoG3wBsE7foBrJ8Lj4C8Lz6C0FjrBkDze8BvWUrYoBrYA_nBU_nBA3IU74BoB3_BUrdAzPwCvmDAzyBUvRUnfwCnnC8BnfwC31BoB7VU_JoB7VUjSUnGoBjXoBrdoBzZkD3rBUjSAzZU3NA7GU3N4DzhCwCvvBoB_OoB7Q8BvMkDjS4DzP0FzUkDnLoBrEkD_JoGnQ0F_OoLvbopBzuD8GvRsJzZgFvMsEzKwH_O0F_J4I_O0KzPkN7QoLvMgKzK0KnL8L7L4wBvvBgP_O0oBrnBkX3X0ZzZgKrJsTrT4IvHsJ_JozBnzBkSvRsOrOoQzP8zBj1BovDzuD49C77CsiB3hBsJjIwHjIsY_YoQ_OgPzPgPzPkN3NoLrOwHnL8G7LoG7LsErJ4IrT8GvRwHvWwHnVwHrT0FvMgF7LsE_JwH3N4IjN4IvMwHrJsE_E0K7L4IrJ0U_T4N3NkrBvqBkwBnuB0hCzhC4SjS0FnGsT3SkNrOwM3N0PjSgKrO0P_T0P7Vg3BnsC44C37DoG3Ige_nBwMnQ4NrTsnBj6Boa_iB0hCz6CkN3Swb3mBgiE71FgoBz3BwRnagK3NoLzP4IrJkwBvjCoQjXoazjB4IvMkI7L4IvMsTna8VzeopBv5B0K_OkIvM8G7L8GvMwHzPoGvR0F7Q4DzPoBzF8BnLkD_O4DzUoBvHkDzP4DzU0Kj6BsE3XsE_YgFjcgF_d4DjSkDvRsT_oD8BvMoB7GkD3SkD_TwCvMkDnQwC7LkD3NgFjSsErOgFzP0F_OwHjSoL_YwH7QwWj1B8G7QsJ7VoG_O4Nze8QrnBwH7QoG3NgFrJsJ_OsJ_OwH7L0ZrnBsY7kBkN_TkNnV8Qna0ZrnBkIjN4SrdgjB_7B4S7fo4Br5CoVvgBkIvMgKzPwH7LwHnLgKzPsOvWkNnV0F3IkI7L8GzK8QzZgP3XoG_JwW_iBwRvbkD_E0ZnpB46Bz6C4IjN0hC_oDkIrOwHzPsJrT0FjN4IzU0jB72CsO_iBkSrsBgKvWoGrO8GnQ0oBjiD4DrJwM_dwHvRwHvR8G3NgKvR4IzPgKnQwMrToQna4crsBwMjSoQzZ8LjS0F3IsEnGgwC75DkXnkB0KnQsT_dwoCzuDsYjmB0KnQoLvRsJ_O0KjSgKjS4I7QoL3Xkcn9B4DjIkXzyBgrCjjFkD7GkDnG4DjIoLrYgergCg3Bn5Dwbz8Boaz3BkSnkBgPrdgK3S8LnVsJnQ4IjNwH7LoG_J0F3I0K3S4XzoB8aztB4c3wB4N3X0Z3rBgZvqB4D_EkDjD4DvC0enzB4InQgK_T0FvM0F3N0FzP4S74B4I_YoG7QgZrlCsT31BgUr7B4Sv5B0F3SgFvRAnGU_EoB_EsE3N8LvlBkDzK8GnVgFrTwCjIoGUgKU4NnB8frEkN7Bo7CvMoQ7BgyBvHgjB_E8GTgKnB0sEzUsnBzFsoDrOsrE_TkrBzF4InB8LnBoL7BkNnBsxBvHkhBrE8a3Dk1BjI0UvCo2CvM0yB_EgZ3Dw5BrJ8zBvH8L7B0PvCgP7BgFT0UjDgrCzKopBzF0gF3XwM7BwvB7GkcrE4S3DkX_E0oB_J4IvCgUzF0Z7G0rC_OwHnB0enGgoBvHgFToLvC8zBrJ0K7B4X_E8QjDouB7GsO7B8f_EsiBrEoVvC0erEghCvHsTjD8LTssB_EgK7BoiCjI0KnB08B7GwWvC8QnBsY3Dwb3DwWvCkIAkX7BoBnBoBTwCnBwCA8BUwCoBkN7B8V7B4IT0KnB8GToLnB8VjDgoB3DkN7BopBrE4XvC8Q7BoQ7BwMT4XvC4NnBwR7B8GToQvC4S7BoGTkNnB0KnB0U7BkX7BsTvCgtBrE8V7B4NnB0jBrE0KnBsJ7B4InBwH7B4IvCwHvC4IjDkI3DsJ_EsJzFwRrJoQrJ0erTwqBzZkhB_T4N3Ik9Cn4BopB_Y4cnQ8Q3IsJ_E0P3IkSrJ8LnG0PvH4N7GwH3DwH3DkSrJ4N7GoLzFkNnG4XnL0tB7V0U_J0FvCsE7B4DToGUgFoBkD8BwCoB0F4D8L0KgUoQgoBsdwyC08B0ZsTwW8QkNgKsO0K4NgK4N0KgPwMkrB4mB4S8Q0ZkXwW0U8zB8uBw5B8zBkNoL8LsJ8LsJ4NsJgPsJ4SoLgPkI8QkIkSkIkzC0jBkyFkuCo2C0jB0oBsOsOgF4NsE0PgFgU0Fw0BsO0hC4SwqBwM4NsEsOgFoQ0F0P0F46BkXswE03B01C4hBgKsEs-C8kB4I4D0hC8awM0FkN8GoL0F0rC0tB0K8G0hCopBwW4NwM4I8LsJ4I8G8G0FoG0F8GwH8GkI4I0KoG4IwHoL8sC8jEoGoLwHkNgKwRsT0jB0FwMgUwgBsO8asJwRgUkmB8GoLwH0K4I8L8GkIgKgK0UgUgeoa0KsJgFgFwHwHoGgFgFsEoG0FopB0jBwWsTssBwlBsTkNkNoGkNsEwMkDwRoB4SnBwMnB8pBzF8ajDkkC3I8a3DgyBnGo4BjIghC_J8arEkS7BsJT0KUkNoBoL8B0KkD4IsEsJ0F8GgF8GoG0F0FwHkIoGwHkIgK8agoB0P4X82C8-DoGkI4IsJkIsJ4IsJ8GoG4I8G4IoGkIgFwqBwWwvBoa00K4yF8xC4rB8QsJ8QsJoQgKoLwH8LkIgPkNoQwMgPoL0ZsTgPwMoQsO4IwH4XsToQkN4NsJgPsJ4NkIsOwHgUsJ4_Bsd8a8LoVgK8zBsYgyB8VgyBwWkhB4NsiBwM89BoVw_DwqB4S8G4XkI0KsE8QoGkXsJ4N0F0hCkc4I4Dg3BkXoGkD4N0F85DgyB4SkI4hBsOoL0F8LoGkN4I8LkIkI8GoGgFkIwH4IkI8G8GoGwHkIsJ8G4IsEoG0F8Gk1B0mCgF8GsT0ZkI0KwM8QgyB8iC8uBo9BsJsOsEoGgFoGgPwRwMsOsJoLwHkIoG8G8GoG0FgFgF4D8GsEoGkDkIkDsiB8LkNsEwmD4cs5CgZkI8BoawH8Q0FoQoG4SkIsOwH8QsJ4SoLkiDg8BwvB4couBwb4cwR8LwHwMkIoQ8L8L4I8LsJ0mC84Bk4CgmC0K4I0KwH8LwHsO4I0jBoVkpCwqB8L8GkI0F4SoLoQkIgPkI0P4IwWoLkS4IgtBkSwWsJ4uCkhBo9BsYwW4IgZsJwrDkmBsOgFgeoL0hCkXkjFw5BgPgFoL4DgrCwb8iCkX0KsEsxBoQgPgFwMkD0K8B8L8B4N8B8Q8BsyD8L8nC8GgP8BsJoBoQ8B0P8BgPwC8QwCgPkD4coG8xCkSoa0FslC4N82CsTgsEge0mCgPwR4DkuCkNwgBgFwgBsEwtCwMkc4Do7CsOkSwCsJ8BkNwCsJwCgKwCsToGwR8GkNgFoagKgUkI09DgyBs0C4hB4wBgU0KsEkNgFgPoGwRwHkNgF0ZsJ0KsE0oBoQw0B0UklE41BgtBsTsxBsT4N0F86FsqC4vE84BwsF4kC46BkXgU4IoLgF0K4D8L4D41B0U08BkX8GkD0hCgZgZsJkc0KkNgFwMsE0oBgP0UwHk8F0mC0mC8a8GwCwHwCgK4DsJkD8QoG0UkI8f8L4mBsOo7CsiBgK4DgKkDgKkD0K8BwMwCwM8BoQoBsOAoQT0PnB4SvCklEvRkrBzFsT7BoLnBkXjDgoBzF0ZjD4NnBgFT4InBsiB_EgjB3DwMnB84BvHwWvC8Q7B4hB_EsETwW3DgZ3Dwb_E8fnG0K7B8fnGwM7B4N7BoLvC4NjDkmBjI0enGoa_E4SjDkNvC8LvCwRrEk6B3N8uBnLk1BvMsT_EsOrE0PrEgKvCsJjD4IjD8L_EsO_E8GvC0FvC0FvCsJrEkNnGUvCUvC8BvC8B7BwCnBwCTwCU8BU0FUsEAsEnB8GvCwbnL8GvCkIvC8LjD0U_EwWvH4zCrYsdjI8f_JsJjDwbjIwWnGkXnGoV7G4XvH8LjD4XjIoQzFoLrE4NnGoVzKsTrJ4hBvR0UzK4I_EouBrYk9C3wBoa3Nwb3NwR_J8G3DgKzFsT7LgU3NwW_O0oBvb0U3N0P_J4NjIoLnG8G3DoQ7GkSnGsT_EsOjD4SvCsYTkhBAkIAkSUoGA8LA49CkD8uBoB8nCkDg4DsEgKUknD4DsOAk_GkIgeoB0oBoBkSUkNTwMnBoLnBgKnBgPjDgKvCwMjDk_B3SkN3DkhBrJ89BjSk9CvbsOrE4IvC0UnGgUzF8kBzKkNrEokBrJkNjD4DnBoL3DkNrEkI7B8kBnLkNjD0PrE4NjDgPvCkSvCsOTgPTgtB7B8kBnB4kCvC0rCvCwbTgZAgPTg8BjDkNTkNToL7BwHnBwH7B8G7BoG7BwHvCsJ3DsJ3DoGjDgK_E4I_E0KzF4IrEoLnGkN7GkNzFgK3DsOrEoLvC0UjD4mBrE4rB_EkmBrEg3B7G4c3D4wB7G0mC_JwWjDkmB_E0erEgoBzF0KnB4InBk2DvR0lFjXgtBnG8uB7G0UjDokBzFsmEnV8lDnQopBnGslCzKofrEgP7BwMTsOT4NAsOoBkSwCofsEwrDwRg3B4IofgFw0B4Iw7Fof8V4D0P8B8QoB4NA4NTkNnBoQjDshEjcksDrYgyBnLozBnLge7G8xHv0BsjDnVkSrEoQjDgPvC0KnBgPnBsOTsOUgKU4SoB8VwC8kBgF4SwCgzDsOgtBsEgtBsE8vD4IgwCkIsT8BwW8BgUwCgPwCs7B8LsuFkmB4I8B0Z0FgPwCsOwCoQwCoiCwHk9CgKoakD84B8G8sC4Io9BwHsiBgFgUkDgjB0F4_B0K4mB0FwgBgFwtCwMouBwHkSkD4IoB4DUgPwC4NwC4NwCsOkDgPsE8LgF4IsE8GsE8LkI8LkIsJkI0KoL0K8LwM4N4NoQ41Bo9BkmB4rBsT8VkhBkmBgZkcs7BkkC0jBkrBgP4S8QoVsT0ZsO8QgKoLoGwHoG8G0FoGkrBgyBkmBouBsOwRgP8QsT8VgUoVwR4S0jB8kBo9B4_BoxCs0Ck7DkgEw5B08B8LwMkuCoxC8QwRwRkSgP8QkNsO8L4N0KwMsJ8LgKkN0K4N4NkSoagjBgPsT0PsTsOwR8QgUsTwW0oBkwB8LsO8kBkrBstD0iEwH4IsOoQkXkcoLwM0KoLoL0K4IwHkIoG0K8G4IgF4NwHsiBwR0PkIsOwH4IgF4I0FwH8G8GwHoGkIgFkIoG0KoG0KkIsO8G4NwHoQwHwRwCoG4DkIoGsOgPkhB8uB8qDkc4_B0FwM0FwMsJ4SwHkNwHoLkI0K8L4N4NsOwR8Q0ZsY8zBgyBkrB0oBsvCkuC8uBouB4xD8vD08B08Bo3Eo3EsYsY8fwgBkX4XkSkSgyB8zB4wBozBk6Bw-BgsE83EsY0Z4wBw0B80D8-DgtB0yBwWgZwM4NwM4N8L8LgKsJ8L0KwM0K0tB4mB0FgFg9DoqD0sEs3Dk-EgnEg1CwoCopB8kBkhBkcofoakS0PkX4S4csYwvB8pB8pBgoBgZkX0Z0Zg8Bw5Bw-Bg8BkSwR0wC8sC4ckc0KgK0P0PsTkS0PgPkI4IwHkIwH4IoGsJ4D8GgFgK4D4I4c8nCsEoLwMof4DgKsEgKsE4IgF4I0FsJwH0KssB84BoGkIkXsd0F8G8GwH8G8G0F4DgFwC4DoB0FoB0FUsEAwHToGnBsd_EwW3Dkc_E0ZrE8VjD4NvC4X3DsOvCwW3D4SjDsJnBsJAkIU8GUoGoBwH8BwHwC0FwC8GgFgFsEsEgFsiBopBkuCs-CkuC0_C4NoQsOwR4NgPwMwMwMwMsiBofsTkS0yBouBgPkN03B8zBokBkhBgKsJoLgKgK4IsJ4I8L8LsJgK08Bk_BgpDwrDsJ4IoL0K0K4IgKkIwM4I8LkI0ZkSgjB4Xk7D4zCo4BkmBgoB8akNsJ0KkIoL4IgKkIwH8GsJkIsOwM4N8LgK4IwHoGwWgUsd8a4XsT8LgKkhB4coQsOwMoLsnBgjBsOkNwRgP41BwvB0oBokBsToQkuCslC8G0FsxBkrBk1B8uB0yBssB0KgKgKsJ4I4IwHkIkIsJg3B4kCksDgnEoGkI0oBsxBopB8zBgyBw-Bw0B0hCk6BwoC8pBw0B8Q8VgKwMsJoLsJgKsJsJoLgK4NoL4I8GkI0FkSkNof8VgP0KgUkNsnBwb0UgP8LsJsJ4IsJgKsEgFgF8GoGgKsE8G0FsJoG0K4SwgBsOgZ0FsJkIsO8L0U4X0tBwH8LgP0ZsiB08BwH8LoGsJ0F4I8GsJsE0FsE0FsEsEgKoLs2Bs2B0PoQ0PoQwMwMsJgKsT4SgKsJsTgUwlB0jB0FoGkDgFwCoGkDkDgFgFkhBwgB8VwWkIwHsJ4I8GgF8GsEoG4DkN7BkI7BkIvCsJrEkN7G0KzFsE7B4DnBgFnB8GAgFjDsEnBkDTsEAgFoB4DwCsEgFkDsEkDoGsE0KoG8G4DgFwCgFwCoGkDkI8B0FoB8GoBkIgUkrB0UgtB0FwMoGkN0F8LsEsJ0FwHsEwHsE4I4DkIoGwM4S0oBkI8Q8GgPoVgtBgF0KgPwgB0Zs2B8L0ZwMoa4I4SoVouBoG4NoQgjBgK0Ukc08BgK8V0F0KwHkNgFkIwHsJ8GoG0FsE4I0FoG4DgFkD0F4DsEkD4DkD4DsE8BUoBoBU8BgFgFkDkDwC4D8BkDkD0F0KwWwH8QsE4IsJsT0FkN8GsO4XozB0F8LkNgegF8LwCgFwCsEkDkD4DwC0FU4DnBsE7BwMzFoGjDsEvCoGrEgP3IgKzF0P3IgFjD0F3DsJnGsJ_EUnBoBnBoBnB8BT8BAoBU8BoBoB8BUkDT8B8BgFoBsEUgFU8G4D4IgF8L8BsE0PofkN4c8B4D0PwgBge8iCkIwRgF8LwH0PoLsYoG4NkDoGoGgPkD8GsEgKkD8GoGwM4IkSkDoGgKoVkDoG0KkX8BsE8Loage4_BsT8pB4SsnB0F4N0PsiBoGkNoGkNwMwb8BsEwRwlBgK0U4Nkc4IgUkIkSoGgP8GsOwM8a8L4X8L8a4Nkc4DkIwH0PkIsT0P4hBsOsdoGkN4D4IwC8GkSopBwHgP4XozBgFgK0FoLkIgPwHwM8GgK8GgK8Q8V8G4IoQ8V4wBk_B0e4mBkXsdoLgP0FwHoG8GwgBgjBwH8GoG0F0F4D4D8B0FwCwHwC8GoBwHA0FAkmBrEsnBrEgZ7BwgB3D0ZvCsJnBgKnBsETwMnB8zB3D4S7Bw0BzF0KnB4DTwHTkSnB0FT0FT8GTgKnB8Q7BoLToGT0KT0ZjDoQnB4NTwHTgFTgtBrEsiB7B0FAoGA0UAkDAoLA0ZA8fkDouBAgrC8B8aU8LTkIToGnB8G7BsJ_EsOvH4N3I0jB_YwCrEwCvCkD7B8V7LUjD8BvCkDnBkDTwCoB8B8BoB8BoBwCkIkNwH8LgUkXwM4NgF0FgF0FwR0U4DgF0FoG4hB4mB4IgKoakcgK0KsEsEkIwHk1BsxBwR0PoG0FoV4S8G8GoG0FsEgF4DgFgF0F0F8GsEoGkSwW4IoLsJoLkwB08BgewlBkwB89BoQ8V8QsY8GoLgFsJoGwMgF0K8V4wB4I4SwH0PoQkhB4c41B8pBwtC8a0yBsO0ZkN0ZgUkmB0oB0rCoQkcoL4SsOoVgK4N8zB0rCoawlBs-CooEwR0ZwlBg3B8LwRoL8QkNwWoLoVwMsYgjB0mC0tB49CwM0Zkcw5B8as2B41BksD8zBgpDsYsxBsiBgmCg8Bw6DkiDgoGgK8V0KkX4IkXoGkS8GgUwHkXwHwW8L0jB0ZosCkI4X4D8L4D0K4DoLoGkSoGwR4I8a4D0K4Sw5BgK0e8L8kB8GoVsE4N8B8G8B0F0FwR0KofwH8VkIoV0P4mB8ak_BoLsYkcsgCgU0tBsTssB8L8awM4c0PsiBgPgekDoG8L8V4DkIsOwbgK4SwM4XsJwRgjBghC0F0K8GkNkD0F4D8GoasxBkSsiBopB4uCgjBoiCwMkX8a0yB4XssBwH4NsOgZgPwWkI8LwWsiB8GgKsJkNkDsEgFkI3IkN7GgPjDgFjDoLzP8uB_iBoqD3c44C_EgP_E4Njcg1CzPouBrJge_EsOvM8kBzZkuC3Sw5BjIsYrTk6B7uBwuE_Ts7B_Tk_BrEoQ3DoQwCkNUoLnB4IToG7BsJ3D8L3DgKoBopBU0PoB0PwCgPkDsO4I8a4D0K4SgyB8L0e4D4IgF0KwH8LoL0P0ZwgBgZgjBsOsTkI8L8GsJ4DgFw5BkuC4X8fsYgjBwgBwqB0ewqB8L8Q4SsY0K4N4N4S8QkX8QkXoV4c0PwWwRwWsJ0FkIwHoGsE8G0F4DsEkDoGwCoGkD4IgF8LoGsOgFoGkcwlBsE0FsnB41B4hBwvB0ZsiB8fwqB8Q4X8asiBwM0PgP4N0KkI4NgKoLwH8GgF4N8GkNsE4N4DsTkDoV4DwM8B4NUwMTgPT8LnB0PvC0K7BoLnBgFTkIT8GAwR8V8pBo4Bge0oBsTgZwW8a8fgjB41Bs7B0KoL8VsYkI4IkI4Ikc8f0FoG0F8GgFwH4D8GkDkIkDkIsEoQsE8QgFoVwRgmC4DoLkD8G0FgK8GgKwH4IsJ4I4IwHgUoQ8qD4uCgtB8fgjB8akNsJ8LsJoLgKgKgKoLwMgjBkmBkkC8sCoage4IoLwH0KwHkN0F8LgF8LoG0PwC4IkD0KwCgKoG4X8BwHkDwMkNsxBoBoGsE4Noa8lDkwBs4FkIgjBoG8asEwWoGofkD8QsEsYkD4NgFwbwC0U8B4XU0jBsEw1D8B0oBwCoasE0Z8Gof0PwjC0Uo7C0FsYoLk6BoBoGkI0jB8B4I0Fkc4DgP4DwMgF4N8GsO0U4wBsJwWkIsTgF0KgFsJ4DoGkDgFoGgKsJwMkIwMkIsOkIwRgF0K4X03BoQ4mBwRopBkzCo_FgPsiBoQ8kB8GoQoG4NgFwM0U4wBoGoQ4DoLwC4IsEoQwM4rB8Q84B4DwMkI0ZwHgewRs7BkN4rB4DsO4DgKkD4I0FwMgKgU0K4SozBs5Ck1B0_CgPwb4I0PwH4NwH4S0FwRwHwb0e4xDwWg1CwWwyC8gD0gKw0BkoFoQ8zB0e0kDge0_C8GoVoLwlB0UghC0FsOoG0P4NkhBwqBolDgkDwtHghC07E8Q8uBge4zC8pB80DsT03BwRkwBoLgZ4I8QsO0ZsO4XgKoQkDgFoLgPgF8BgFwCwM4I8LwH4IsEwR4IwR4I4SsJoG4D4I0F8G0FwHoGkIwH0FoGoGkI4IoLwvBkkC8LwRsE0FkNsTkcopB0KsOoGsJkN4SkhBkwB8GsJ4D0FgwC0zDsvCwwDkc0oBozB8nCokB8zBsOgUsOgUwW8fwM8QsJwMwHsJoGwHwHkI8GwHsJsJ8iC89BwqBwlBkcgZoL0K4NwMwWoVofofoL0K0P8QwgB0ek6Bo4B44Cs0Co9Bs7Bw3C4zC8G8G0PsOoL0KwMwM8BUoB8BoG0FsJgKge4cozBkwBge4cwMoL4X4XoVsTolD0_C0jBgjBoVsTsJ4IkIkIsvC0rCwR8QkXoVgKgKkhB8f8QsOkNsJ8BA8BUwH3D8L_EgPvHwbjN4c3N4c3N0FjDwH3D0e_O8LzFopB_TkIrEsEvCkIrEgPjI0KzFgPjIkIrEwM7G0FjDoBToLnG0P3IgZ3NoLnGwHjDsJ3DsJ3D0PvCgtBjIoanGsxB7LsJ7BofvHgmC7Q06CnVwRrEwgBjIgjB7G84BnLwW3D8L7BsnBzF84BrJ8L7BoGnBoVjDosCvM44C3NsxBjI46BzK0FT0K7BoQjD4S7B8QvCgUvCgUjDkN7BwMjDsnBvHoGnB0UjDsTjD4ITwWjD4N7BwW3DwRvCkwBvHsY3Ds2BrJw0BjIsOvCsYrE4cnG4XnGwRzF8ajI0UnGgZvHwvB3NwWnGkX7G8kBnLsJvC4XvHgoBvM4X7G8QrEoQ_EgZvH0tB3N4mB7LsOrEwbjIsOrEgZvHsYjI4NnGsJ_EgFvCgUnLsdnQoVvMwgBvRsTzKsYjN8Q_JgZ3N0mC3mBgjBrTsTzKwbzPgenQgPjIwM7G0KnG0KzF8G3D0UnL4DvC8G3D0oB7VkD7B4I_EwqBrY0ZrOkNjIwHrEgFvCkIrEgFvC0FvCkD7BwMvHkNnG8L7GwMvHsdnQoLnG4NvH4NvH8QnL4XjN4hB7QouB_YkrB3X4NvHgoB7V4XjN0UnLwW7LsOvHoLnG0KnG0UnLsTnLoQrJ4I_EkIrE4NvHwRzK0PrJ0U7LkXvMwMvHsOjIgPjIwR_JkXjNsY3NgUzKokBzU0P3IgZ3NkXvMs2BzegKzF4I_EkD7BgFjDkkC7kB0P3IgUzK8kB_TouBzZ4czPkNvH0UnLoV7L8BnBoQjIwRrJkNzF4N3DgPjDsET4InBgUjDwCT0Z_EoQjDoL7B0P3DoQ3D4N7BoVrEwRjDgezFwWrEgK7BgjBnGoLvCgZ_EwlB7GoVrE8LvCsdnGgZnG0F7BsOzFwRvHsOzFgevM0ZnLw0B7VwwDjwBgP7GwWrJ0ZnLw0BjXgrCjhB0K_EgZrJs2B_Y8V3IoGvCwlBzPkc7L4X_JgF7BkNzF4NzF8BT0FvCgKrE4D7B0FvC8anL0ZzKwbnLwhD7pBwWrJsdvMoLrEkXvHsJ3DwW8L4NwHgFgFwMgF4NoG0K0FwMoGoLgF0PwHwM0FgZoLgjBoQ4N8G8LoGwW0KoGwCkNoG4IsE4S4IkI4D0K0F0PwHwMoG0PwH8GkD8BoBkSkIkXoL0FkDoQwHwR4I8V0K8QkI0KgF8G4DsO8G4NoGoL0F8GkDgZwM0KgFoL0FoBUkIsEwM8GoGUsJkD8GwCkN8G4D3DsEAkDwCwC4DwH4DwHoGwR0KgFgFkIsE0K0FoL0FkN0FkXoL0PwHgPwHwCUwR4IsE8BgUgK4S4I8GkD0FkDkNoGwH4D4IsE0KgF4IsEwCoBgFwC4S4IkSsJgFwCkD8B8BUgFwCwHsEgFkDgF8BgFwCwH4DsJ4DoBUkD8B0KgFwHkD0FkDwH4D0FkD0FwCsJgFgFwC0FwCkN8GoBUgP8GkSsJwW0KwH4DkS4IkS4IwR4I0P8GwMoG8LoG4D8B8GkD8GkDsEwCoG4DsEwC4D8BgF8B4D8BkDoBgjB8QsO0FoLAgFAsEnBsE7B4D7BgFrE4DrEwCjDkD_EoBzFoBjIUjIwC7GoB7pBwCvoC8Bj1B8B74BoB3cA_EwC7vDAvH8B3mBUvWU3IUjXA_EU_JAvHUnLoBvtCUrJUnLU_nBUzUwCrO4I7f8BnGgFvR0U3_BgKkDwMsEsT0F8V4IsJ4DsOoGsJ4D4DoBoGwCsE8BkIsEkI4DsO8GgKsEkX0KwWsJkI4D8GkDsOwH8GkD4DwCwHgF4DwCoLkIkI0FkDwC0U4NoGsEsJoGkNgKgPgK8G4DoG8BkDoB8G0FgP4I8L0FoBUgPoGsJgFkD8BwC3IqM14B";

          // convert Flexible Polyline encoded string to geometry
          const lineStrings = [];
          lineStrings.push(
            H.geo.LineString.fromFlexiblePolyline(polylineString)
          );
          const multiLineString = new H.geo.MultiLineString(lineStrings);
          const bounds = multiLineString.getBoundingBox();

          // Create the polyline for the route
          const routePolyline = new H.map.Polyline(multiLineString, {
            style: {
              lineWidth: 4,
              strokeColor: "rgba(0, 128, 255, 0.7)",
            },
          });
          // Set the map object to the reference
          map.current = newMap;
          map.current.addObject(marker);
          map.current.addObject(routePolyline);
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    }
  }, [restaurantPosition, platform, map]);

  function getMarkerIcon(color) {
    const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="marker">
                <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
                </g></svg>`;
    return new H.map.Icon(svgCircle, {
      anchor: {
        x: 10,
        y: 10,
      },
    });
  }

  function calculateRoute(platform, map, start, destination) {
    function routeResponseHandler(response) {
      const sections = response.routes[0].sections;
      const lineStrings = [];
      sections.forEach((section) => {
        // convert Flexible Polyline encoded string to geometry
        lineStrings.push(
          H.geo.LineString.fromFlexiblePolyline(section.polyline)
        );
      });
      const multiLineString = new H.geo.MultiLineString(lineStrings);
      const bounds = multiLineString.getBoundingBox();

      // Create the polyline for the route
      const routePolyline = new H.map.Polyline(multiLineString, {
        style: {
          lineWidth: 5,
        },
      });

      // Remove all the previous map objects, if any
      map.removeObjects(map.getObjects());
      // Add the polyline to the map
      map.addObject(routePolyline);
      map.addObjects([
        // Add a marker for the user
        new H.map.Marker(start, {
          icon: getMarkerIcon("red"),
        }),
        // Add a marker for the selected restaurant
        new H.map.Marker(destination, {
          icon: getMarkerIcon("green"),
        }),
      ]);
    }

    // Get an instance of the H.service.RoutingService8 service
    const router = platform.getRoutingService(null, 8);

    // Define the routing service parameters
    const routingParams = {
      origin: `${start.lat},${start.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      transportMode: "car",
      return: "polyline",
    };
    // Call the routing service with the defined parameters
    router.calculateRoute(routingParams, routeResponseHandler, console.error);
  }

  // Return a div element to hold the map
  return (
    <div
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      ref={mapRef}
      className=" absolute top-0"
    />
  );
};

export default MapComponent;
