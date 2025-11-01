import { Lang } from '@/app/(types)/lang'
import LoginForm from '@/components/login/LoginForm'

export default function LoginPage() {
	return <LoginForm lang={"en" as Lang} />
}
