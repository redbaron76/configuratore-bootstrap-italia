import Colr from "colr";
import isArray from "lodash/isArray";

export const hsbToHex = hsb => {
  if (isArray(hsb)) {
    const colr = Colr().fromHsvArray(hsb);
    return colr.toHex();
  }
};

export const hexToHSB = hex => {
  if (hex && hex.length >= 4) {
    const colr = Colr().fromHex(hex.replace("#", ""));
    return colr.toHsvArray();
  }
};

export const getStyleColor = (hex, b, amt, amt2) => {
  if (hex && hex.length === 7) {
    let tmpHex = hex.replace("#", "");
    let tmpHsb = hexToHSB(tmpHex);

    if (isArray(tmpHsb)) {
      if (b) {
        tmpHsb.pop();
        tmpHsb.push(b);
      }

      console.log("tmpHsb", tmpHsb);

      tmpHex = hsbToHex(tmpHsb);

      console.log("tmpHex", tmpHex);
    }

    let tmpColr = Colr.fromHex(tmpHex);

    if (amt && amt < 0) tmpColr = tmpColr.darken(amt * -1);
    if (amt && amt > 0) tmpColr = tmpColr.lighten(amt);

    if (amt2 && amt2 < 0) tmpColr = tmpColr.darken(amt2 * -1);
    if (amt2 && amt2 > 0) tmpColr = tmpColr.lighten(amt2);

    return tmpColr.toHex();
  }
  return "";
};

// #0059b3 .it-header-slim-wrapper => $header-slim-bg-color => $primary-a7 => hsb($primary-h, $primary-s, 70);
// #0066cc .it-header-center-wrapper => $header-center-bg-color => $primary-a6 => hsb($primary-h, $primary-s, 80);
// #003366 .it-footer-main => $bg-footer => darken($primary, 20%) = hsb($primary-h, $primary-s, $primary-b);
// #001a33 .it-footer-small-prints => darken($bg-footer, 10%) => hsb($primary-h, $primary-s, $primary-b)
// #0066cc .btn-primary => $primary-a6 => hsb($primary-h, $primary-s, 80);
