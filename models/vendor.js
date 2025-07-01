// models/Vendor.js
const { sql, config } = require('../mssql'); //here in mssql.js i have given the configuration of the database system

class Vendor {
  constructor(data) {
    this.vendorId = data.vendorId;
    this.Name = data.Name;
    this.OrganisationName = data.OrganisationName;
    this.EmailId = data.EmailId;
    this.MobileNumber = data.MobileNumber;
    this.Role = data.Role;
    this.IsRegistered = data.IsRegistered;
    this.RegDate = data.RegDate;
    this.Token = data.Token;
    this.UserName = data.UserName;
    this.Password = data.Password;
  }


  

  static async getAll() {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM VendorReg_tbl');
    return result.recordset;
  }

  static async getByVendorId(vendorId) {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input('vendorId', sql.VarChar, vendorId)
      .query('SELECT * FROM VendorReg_tbl WHERE vendorId = @vendorId');
    return result.recordset[0];
  }

  async save() {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input('vendorId', sql.VarChar, this.vendorId)
      .input('Name', sql.VarChar, this.Name)
      .input('OrganisationName', sql.VarChar, this.OrganisationName)
      .input('EmailId', sql.VarChar, this.EmailId)
      .input('MobileNumber', sql.VarChar, this.MobileNumber)
      .input('Role', sql.VarChar, this.Role)
      .input('IsRegistered', sql.Bit, this.IsRegistered)
      .input('RegDate', sql.DateTime, this.RegDate)
      .input('Token', sql.VarChar, this.Token)
      .input('UserName', sql.VarChar, this.UserName)
      .input('Password', sql.VarChar, this.Password)
      .query(`
        INSERT INTO VendorReg_tbl
        (vendorId, Name, OrganisationName, EmailId, MobileNumber, Role, IsRegistered, RegDate, Token, UserName, Password)
        VALUES (@vendorId, @Name, @OrganisationName, @EmailId, @MobileNumber, @Role, @IsRegistered, @RegDate, @Token, @UserName, @Password)
      `);
  }
}

module.exports = Vendor;
