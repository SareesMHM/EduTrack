import { ErrorPage } from './NotFound';
export default function Forbidden() {
  return <ErrorPage code="403" title="You don’t have access to this page" hint="Your account role can’t open it. Ask an administrator if you think this is a mistake." />;
}
