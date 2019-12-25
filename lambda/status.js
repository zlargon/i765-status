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

  // parse HTML
  const html = await res.text();
  const $ = cheerio.load(html);

  // error
  let body = $('#formErrorMessages').html();

  // success
  const status = $('div.rows.text-center h1').text();
  if (status) {
    const details = $('div.rows.text-center p').text().split('  ');
    body = `
      <h2>${status}</h2>
      <ul>${details.map(s => `<li>${s}</li>`).join('\n')}</ul>`;
  }

  return {
    statusCode: res.status,
    headers: { 'Content-Type': 'text/html' },
    body
  };
};
