import { Form, redirect, useActionData, useTransition } from 'remix';
import type { ActionFunction } from 'remix';
import invariant from 'tiny-invariant';

import { createPost } from '~/post';

type ActionFunctionErrors = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();
  const title = formData.get('title'),
    slug = formData.get('slug'),
    markdown = formData.get('markdown');

  const errors: ActionFunctionErrors = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === 'string');
  invariant(typeof slug === 'string');
  invariant(typeof markdown === 'string');
  await createPost({ title, slug, markdown });
  return redirect('/admin');
};

const NewPost = () => {
  const errors = useActionData();
  const transition = useTransition();

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title && <em>Title is required</em>}
          <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug && <em>Slug is required</em>}
          <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{' '}
        {errors?.arkdown && <em>Markdown is required</em>}
        <br />
        <textarea name="markdown" rows={10} />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? 'Creating...' : 'Create Post'}
        </button>
      </p>
    </Form>
  );
};

export default NewPost;
