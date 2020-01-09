class Whitelist {
  constructor(sheet) {
    this.sheet = sheet;
  }

  async hasPhone(phone) {
    const rows = await new Promise((resolve, reject) => {
      this.sheet.getRows({
        offset: 1,
        limit: 1,
        query: `phone = "${phone}"`,
      }, (err, rows) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(rows);
        }
      });
    });

    return !!rows.length;
  }
}

export default Whitelist;
