import dayjs from 'dayjs';
import readline from 'readline';
import { Table } from 'console-table-printer';
import { Request } from './Request.js';

export default class Oaxis extends Request {
  static buyPackageURL = 'https://trxpackages.api.axis.co.id/package/buy/v2';
  static claimURL = 'https://trxpackages.api.axis.co.id/claimmccm/v3';
  static quotaInfoURL = 'https://quota.api.axis.co.id/quota';
  static packageListURL = 'https://packages.api.axis.co.id/packages/v2';

  async buy(packageId, type = 'PACKAGE') {
    const content = {
      repurchase: false,
      service_type: type,
      soccd: '',
      service_id: packageId,
    };

    await this.post(Oaxis.buyPackageURL, content);
    console.log(`Your transaction has made.`);
  }

  async claim(packageName, type = 'SACHET') {
    const content = {
      offer_id: isNaN(packageName) ? 'null' : packageName,
      offer_type: type,
    };

    switch (packageName.toLowerCase()) {
      case 'aov':
        content.offer_id = '16009';
        break;
      case 'freefire':
        content.offer_id = '16031';
        break;
      case 'hago':
        content.offer_id = '16015';
        break;
      case 'joox':
        content.offer_id = '15993';
        break;
      case 'kwai':
        content.offer_id = '25032';
        break;
      case 'l2r':
        content.offer_id = '16024';
        break;
      case 'nimo':
        content.offer_id = '16065';
        break;
      case 'smule':
        content.offer_id = '16270';
        break;
      case 'tinder':
        content.offer_id = '29721';
        break;
      case 'tiktok':
        content.offer_id = '16034';
        break;
      case 'viu':
        content.offer_id = '25214';
        break;
    }

    await this.post(Oaxis.claimURL, content);
    console.log(`Your transaction has made.`);
  }

  async list(keyword = 'all') {
    const result = await this.get(Oaxis.packageListURL);
    const packageList = JSON.parse(atob(result.data));

    const [RECOMMENDED, INTERNET, BOOSTR] = packageList.filter(
      (value) =>
        value.group_name === 'Recommended' ||
        value.group_name === 'Internet' ||
        value.group_name === 'Boostr'
    );

    if (keyword === 'all' || keyword === 'nbo') {
      this.createPackagesTable(
        'RECOMMENDED PACKAGES (NBO_AXISNET)',
        RECOMMENDED
      ).printTable();
    }

    if (keyword === 'all' || keyword === 'internet') {
      this.createPackagesTable(
        'INTERNET PACKAGES (PACKAGE)',
        INTERNET
      ).printTable();
    }

    if (keyword === 'all' || keyword === 'boostr') {
      this.createPackagesTable(
        'BOOSTR PACKAGES (PACKAGE)',
        BOOSTR
      ).printTable();
    }
  }

  async listActive() {
    const result = await this.get(Oaxis.quotaInfoURL);

    const packageList = JSON.parse(atob(result.data)).result.detail;

    // package details table
    const details = new Table({
      columns: [
        { name: 'id' },
        { name: 'name', alignment: 'left' },
        { name: 'remaining', alignment: 'left' },
        { name: 'until', alignment: 'left' },
      ],
    });

    packageList.forEach((value) => {
      details.addRow({
        id: value.serviceId,
        name: value.name,
        remaining: value.remaining,
        until: dayjs(value.benefitData.activeUntil).format('DD-MM-YYYY HH:mm'),
      });
    });

    details.printTable();
  }

  async confirm() {
    const rl = readline.createInterface({
      input: process.stdin,
    });

    process.stdout.write('Are you sure to continue? (y/N): ');
    for await (const line of rl) {
      if (line === 'y' || line === 'yes') {
        break;
      } else {
        console.log('Canceled...');
        throw 0;
      }
    }
  }

  createPackagesTable(title, list) {
    // create table
    const packageTable = new Table({
      columns: [
        { name: 'id' },
        { name: 'name', alignment: 'left' },
        { name: 'price' },
        { name: 'exp', alignment: 'left' },
      ],
      title,
    });

    list.categories.forEach((value) =>
      value.packages.forEach((value) => {
        packageTable.addRow({
          id: value.id,
          name: value.name,
          price: value.price,
          exp: value.exp,
        });
      })
    );

    return packageTable;
  }
}
