import './globals.css';
import { AuthWrapper } from './components/wrappers/AuthWrapper';
import RemoteApp from './exposes/RemoteApp';

const FRONTEGG_AUTH_URL = import.meta.env.FRONTEGG_AUTH_URL;
const FRONTEGG_APPLICATION_ID = import.meta.env.FRONTEGG_APPLICATION_ID;

const App = () => {
	return (
		<div className='flex justify-center items-center h-screen'>
			<AuthWrapper authUrl={FRONTEGG_AUTH_URL} appId={FRONTEGG_APPLICATION_ID}>
				<RemoteApp />
			</AuthWrapper>
		</div>
	);
};

export default App;
