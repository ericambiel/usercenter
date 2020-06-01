let lastLogon; // Windows NT time format', 'Win32 FILETIME or SYSTEMTIME'
let whenCreated; // YYYYMMDDHHMMSS.0[+/-]HHMM
let whenChanged; // YYYYMMDDHHMMSS.0[+/-]HHMM

/**
 * Descreve modelo LDAP AD
 */
export class LDAPUserAD {
  objectGUID: string;
  objectSid: string;
  cn: string; // Full Name
  sn: string; // Last Name
  givenName: string; // First Name
  sAMAccountName: string; // Logon Name Pre Win 2000
  userPrincipalName: string; // Logon Name
  displayName: string;
  mail: string;
  memberOf: Array<string>;
  userAccountControl: number;

  get lastLogon(): Date { return fromLDAPTV(lastLogon); }
  set lastLogon(value) { lastLogon = value; }

  get whenCreated(): Date { return fromLDAPString(whenCreated); }
  set whenCreated(value) { whenCreated = value; }

  get whenChanged(): Date { return fromLDAPString(whenChanged); }
  set whenChanged(value) { whenChanged = value; }

}

/**
 * Convert LDAP number time value to Date.
 * Converte datas do tipo numérico LDAP para Date.
 * @param date Data em formato numérico LDAP
 */
function fromLDAPTV(date: number) {
  return new Date(date / 1e4 - 1.16444736e13);
}

/**
 * Convert LDAP string time value to Date.
 * Converte datas do tipo string LDAP para Date.
 * @param date Data em formato string
 */
function fromLDAPString(date: string) {
  const b = date.match(/\d\d/g);
  return new Date(Date.UTC(Number(b[0]) + Number(b[1]), Number(b[2]) - 1, Number(b[3]), Number(b[4]), Number(b[5]), Number(b[6])));
  // tslint:disable-next-line: max-line-length
  // return new Date(Date.UTC(Number(`${dateB[0]}${dateB[1]}${dateB[2]}${dateB[3]}`),Number(`${dateB[4]}${dateB[5]}`), Number(`${dateB[6]}${dateB[7]}`), Number(`${dateB[8]}${dateB[9]}`),Number(`${dateB[10]}${dateB[11]}`), Number(`${dateB[12]}${dateB[13]}`)));
}

