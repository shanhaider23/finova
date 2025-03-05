'use client';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const savedDarkMode = localStorage.getItem('darkMode') === 'true';
		setDarkMode(savedDarkMode);
		if (savedDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	const toggleDarkMode = () => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		localStorage.setItem('darkMode', newDarkMode);
		if (newDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	return (
		<button onClick={toggleDarkMode}>
			{darkMode ? (
				<Sun size={30} absoluteStrokeWidth />
			) : (
				<Moon size={30} absoluteStrokeWidth />
			)}
		</button>
	);
}
