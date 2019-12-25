import fetch from 'node-fetch';
import cheerio from 'cheerio';

export async function main(event) {
  const { receipt_number } = event.pathParameters;

  const res = await fetch('https://egov.uscis.gov/casestatus/mycasestatus.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'https://egov.uscis.gov/casestatus/landing.do',
    },
    body: `changeLocale=&appReceiptNum=${receipt_number}&initCaseSearch=CHECK+STATUS`
  });

  const html = await res.text();
  const $ = cheerio.load(html);
  let result = $('div.rows.text-center').html();
  if (result === null) {
    result = html;
  }

  return {
    statusCode: res.status,
    headers: {
      'Content-Type': 'text/html'
    },
    body: result
  };
};
