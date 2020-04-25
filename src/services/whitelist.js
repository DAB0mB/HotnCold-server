class Whitelist {
  constructor(sheet, { disabled } = {}) {
    this.sheet = sheet;
    this.disabled = !!disabled;
  }

  async hasPhone(phone) {
    if (this.disabled) {
      return true;
    }

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
