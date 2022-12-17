interface SecurityModel{
  id: string,
  password: string
}

interface SecurityTables{
  users: string,
  auth: string
}
export {SecurityModel, SecurityTables};
