import type React from 'react';
import { useState } from 'react';
import '@/globals.css';
// import { useAuthUser } from '@frontegg/react';
import { Button } from '../atoms/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../atoms/card';

const Provider: React.FC = () => {
	// const user = useAuthUser();
	const [count, setCount] = useState(0);
	return (
		<Card className='w-80 h-80 bg-fill-base-1'>
			<CardHeader>
				<CardTitle className='title'>Hello, test-user</CardTitle>
				<CardDescription className='title'>
					This is Module Federation 2.0
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				<p>
					This component is an example of a component that is shared between the
					host and the provider.
				</p>
				<p>Count: {count}</p>
			</CardContent>
			<CardFooter>
				<Button variant='default' onClick={() => setCount(count + 1)}>
					Click me
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Provider;
