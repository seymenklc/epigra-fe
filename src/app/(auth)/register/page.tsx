"use client"
import { TextInput, PasswordInput, Text, Paper, Group, Button, Divider, Anchor, Stack } from '@mantine/core';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'
import { type RegisterCredentials, RegisterSchema } from '@/lib/zod';
import { auth } from '@/lib/firebase';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { updateProfile } from 'firebase/auth';
import { notifications } from '@mantine/notifications';
import React from 'react'
import { FirebaseErrors, PageRoutes } from '@/utils/enums';

export default function AuthenticationForm(): React.JSX.Element {
	const router = useRouter()
	const [createUserWithEmailAndPassword, _user, isSubmitting, error] = useCreateUserWithEmailAndPassword(auth);

	const {
		register,
		handleSubmit,
		reset: resetForm,
		formState: { errors: formErrors }
	} = useForm<RegisterCredentials>({ resolver: zodResolver(RegisterSchema) })

	const onSubmit: SubmitHandler<RegisterCredentials> = async (data) => {
		const response = await createUserWithEmailAndPassword(data.email, data.password);

		if (response && response.user) {
			await updateProfile(response.user, { displayName: data.username })

			resetForm()

			notifications.show({
				color: 'green',
				title: 'Success',
				message: 'Account created successfully! Redirecting...',
			})

			// simulate a delay for the user to see the success message
			setTimeout(() => router.push(PageRoutes.Home), 1000)
		}
	}

	React.useEffect(() => {
		if (error && error.code === FirebaseErrors.AuthEmailAlreadyInUse) {
			notifications.show({
				color: 'red',
				title: 'Error',
				message: 'Email already in use! Please try again with a different email.',
			})
		}
	}, [error])

	return (
		<Paper radius="md" p="xl">
			<Text size="lg" fw={500}>
				Welcome to Time Tracker
			</Text>
			<Divider labelPosition="center" my="lg" />
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack>
					<TextInput
						{...register('username')}
						radius="md"
						label="Username"
						type='text'
						placeholder="Your username"
						error={formErrors.username?.message}
					/>
					<TextInput
						{...register('email')}
						label="Email"
						radius="md"
						placeholder="hello@mantine.dev"
						error={formErrors.email?.message}
					/>
					<PasswordInput
						{...register('password')}
						label="Password"
						radius="md"
						placeholder="Your password"
						error={formErrors.password?.message}
					/>
					<PasswordInput
						{...register('confirmPassword')}
						radius="md"
						label="Confirm password"
						placeholder="Confirm your password"
						error={formErrors.confirmPassword?.message}
					/>
				</Stack>
				<Group justify="space-between" mt="xl">
					<Anchor
						size="xs"
						c="dimmed"
						type="button"
						component="button"
						onClick={() => router.push(PageRoutes.Login)}
					>
						Already have an account? Login
					</Anchor>
					<Button loading={isSubmitting} disabled={isSubmitting} type="submit" radius="xl">
						Register
					</Button>
				</Group>
			</form>
		</Paper>
	);
}
