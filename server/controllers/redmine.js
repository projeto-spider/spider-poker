import got from 'got';

export async function issues(ctx) {
  const { project, hostname, key = '' } = ctx.request.query;
  const auth = ctx.headers.authorization || false;

  [project, hostname]
    .forEach(param => ctx.assert(param, 404, 'Invalid request'));

  const url = `${hostname}/projects/${project}/issues.json`;

  console.log(url, ctx);

  try {
    const { body } = await got.get(url, {
      query: { key },
      headers: { Authorization: auth },
    });

    ctx.body = body;
  } catch(err) {
    ctx.throw(err.statusCode, err.statusMessage);
  }
}

