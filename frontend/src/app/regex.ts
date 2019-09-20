export function isValidPass(pass: string): Boolean {
  let regex1 = /^(?=.*[a-z].*[a-z].*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\d\w]).{8,12}$/;
  let regex2 = /^[a-zA-Z].*$/;
  let regex3 = /(.)\1{2,}/;
  return regex1.test(pass) && regex2.test(pass) && !regex3.test(pass);
}
export function isValidId(id: string): Boolean {
  if (!/^\d{13}$/.test(id)) return false;
  let s = 0;
  for (let i = 0, j = 7; i < id.length - 1; i++, j--) {
    if (j == 1) j = 7;
    s += j * parseInt(id.charAt(i));
  }
  let m = s % 11;
  let k = parseInt(id.charAt(id.length - 1));
  return (k == 0 && m == 0) || (m > 1 && k == 11 - m);
}

export function isValidEmail(mail : string): Boolean {
  let regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(mail);

}