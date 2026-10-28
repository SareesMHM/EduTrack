import { ErrorPage } from './NotFound';
export default function ServerError() {
  return <ErrorPage code="500" title="Something went wrong on our side" hint="Try again in a minute. If it keeps happening, tell your administrator." />;
}
