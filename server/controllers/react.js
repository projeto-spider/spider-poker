import serverSideRender from '../lib/server-side-render';
import frontEndScripts from '../lib/front-end-scripts';

export async function index(ctx) {
  const { rendered, head, state } = await serverSideRender()
    .catch(err => {
      console.log(err);
      if (err.code && err.msg) {
        ctx.throw(err.code, err.msg);
      } else {
        ctx.throw(404, "Page doesn't exist");
      }
    });

  const scripts = frontEndScripts();

  await ctx.render('index', {
    head,
    rendered,
    state,
    scripts,
  });
};
