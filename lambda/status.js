export async function main(event) {
  const { receipt_number } = event.pathParameters;

  return {
    statusCode: 200,
    body: JSON.stringify({
      receipt_number
    })
  };
}
