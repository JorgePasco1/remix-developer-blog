import path from 'path';
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';
import { processMarkdown } from '@ryanflorence/md';

export type Post = {
  slug: string;
  html?: string;
  title: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

const POSTS_PATH = path.join(__dirname, '../posts');

const isValidPostAttributes = (
  attributes: any
): attributes is PostMarkdownAttributes => {
  return attributes?.title;
};

export const getPosts = async (): Promise<Post[]> => {
  const dir = await fs.readdir(POSTS_PATH);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(POSTS_PATH, filename));
      const { attributes } = parseFrontMatter(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad metadata!`
      );
      return {
        slug: filename.replace(/\.md$/, ''),
        title: attributes.title,
      };
    })
  );
};

export const getPost = async (slug: string): Promise<Post> => {
  const filepath = path.join(POSTS_PATH, `${slug}.md`);
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes.`
  );
  const html = await processMarkdown(body);
  return { slug, html, title: attributes.title };
};
