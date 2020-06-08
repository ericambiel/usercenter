import { Serializable } from '../libs/Serializable';


/**
 * Descreve modelo LDAP AD
 */
export class LDAPUserAD extends Serializable {
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
  private _userAccountControl;
  private _lastLogon; // Windows NT time format', 'Win32 FILETIME or SYSTEMTIME'
  private _whenCreated; // YYYYMMDDHHMMSS.0[+/-]HHMM
  private _whenChanged; // YYYYMMDDHHMMSS.0[+/-]HHMM

  get userAccountControl(): string { return userAccountControlHandling(Number(this._userAccountControl)); }
  set userAccountControl(value) { this._userAccountControl = value; }


  get lastLogon(): Date { return fromLDAPTV(Number(this._lastLogon)); }
  set lastLogon(value) { this._lastLogon = value; }

  get whenCreated(): Date { return fromLDAPString(this._whenCreated); }
  set whenCreated(value) { this._whenCreated = value; }

  get whenChanged(): Date { return fromLDAPString(this._whenChanged); }
  set whenChanged(value) { this._whenChanged = value; }
}

/**
 * Convert LDAP number time value to Date.
 * Converte datas do tipo numérico LDAP para Date.
 * @param dateNumber Data em formato numérico LDAP
 */
function fromLDAPTV(dateNumber: number): Date {
  if (typeof dateNumber === 'number' && dateNumber > 0) {
    const date = new Date(dateNumber / 1e4 - 1.16444736e13); // TODO: colocar em configurações
    return date;
  } else {
    return null;
  }
}

/**
 * Convert LDAP string time value to Date.
 * Converte datas do tipo string LDAP para Date.
 * @param dateString Data em formato string
 */
function fromLDAPString(dateString): Date {
  const dateB = dateString.match(/\d\d/g);

  const date = new Date(
    Date.UTC(
      Number(`${dateB[0]}${dateB[1]}`), // Ano
      Number(dateB[2]) - 1, // Mês
      Number(`${dateB[3]}`), // DIa
      Number(`${dateB[4]}`), // Hora
      Number(`${dateB[5]}`), // Minuto
      Number(`${dateB[6]}`) // Segundo
    )
  ); // TODO: colocar em configurações

  return date;
}

function userAccountControlHandling(userAccountControl: number): string {
  if (typeof userAccountControl === 'number') {
    switch (userAccountControl){
      case 1: return 'Script'; // SCRIPT	1
      case 2: return 'Conta Desabilitada'; // ACCOUNTDISABLE	2
      case 8: return 'Necessário Diretório Home'; // HOMEDIR_REQUIRED	8
      case 16: return 'Conta Bloqueada'; // LOCKOUT	16
      case 32: return 'Senha não necessária'; // PASSWD_NOTREQD	32
      case 64: return 'Usuário não pode mudar senha'; // PASSWD_CANT_CHANGE	64
      case 128: return 'Texto da senha permite encriptação'; // ENCRYPTED_TEXT_PWD_ALLOWED	128
      case 256: return 'TEMP_DUPLICATE_ACCOUNT'; // TEMP_DUPLICATE_ACCOUNT	256
      case 512: return 'Conta Habilitada'; // NORMAL_ACCOUNT	512
      case 514: return 'Conta Desabilitada'; // Disabled Account	514
      case 544: return 'Conta Habilitada, não necessário senha'; // Enabled, Password Not Required	544
      case 546: return 'Conta Desabilitada, não necessário senha'; // Disabled, Password Not Required	546
      case 2048: return 'INTERDOMAIN_TRUST_ACCOUNT'; // INTERDOMAIN_TRUST_ACCOUNT	2048
      case 4096: return 'WORKSTATION_TRUST_ACCOUNT'; // WORKSTATION_TRUST_ACCOUNT	4096
      case 8192: return 'SERVER_TRUST_ACCOUNT'; // SERVER_TRUST_ACCOUNT	8192
      case 65536: return 'DONT_EXPIRE_PASSWORD'; // DONT_EXPIRE_PASSWORD	65536
      case 66048: return 'Conta Habilitada, senha não expira'; // Enabled, Password Doesn’t Expire	66048
      case 66050: return 'Conta Desabilitada, senha não expira'; // Disabled, Password Doesn’t Expire	66050
      // tslint:disable-next-line: max-line-length
      case 66082: return 'Conta Desabilitada, senha não expira e não necessário senha'; // Disabled, Password Doesn’t Expire & Not Required	66082
      default: return 'Estado desconhecido';
    }

  }

  // MNS_LOGON_ACCOUNT	131072
  // SMARTCARD_REQUIRED	262144
  // Enabled, Smartcard Required	262656
  // Disabled, Smartcard Required	262658
  // Disabled, Smartcard Required, Password Not Required	262690
  // Disabled, Smartcard Required, Password Doesn’t Expire	328194
  // Disabled, Smartcard Required, Password Doesn’t Expire & Not Required	328226
  // TRUSTED_FOR_DELEGATION	524288
  // Domain controller	532480
  // NOT_DELEGATED	1048576
  // USE_DES_KEY_ONLY	2097152
  // DONT_REQ_PREAUTH	4194304
  // PASSWORD_EXPIRED	8388608
  // TRUSTED_TO_AUTH_FOR_DELEGATION	16777216
  // PARTIAL_SECRETS_ACCOUNT	67108864

}
