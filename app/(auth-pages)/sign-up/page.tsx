import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function SignUp(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">注册许愿池</h1>
          
          <form className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </Label>
              <Input
                name="email"
                placeholder="你的邮箱"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </Label>
              <Input
                type="password"
                name="password"
                placeholder="设置密码"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                确认密码
              </Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="再次输入密码"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <SubmitButton 
              pendingText="Signing Up..." 
              formAction={signUpAction}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              注册
            </SubmitButton>
            
            <div className="text-sm text-gray-600 text-center">
              已有账号?{' '}
              <Link href="/sign-in" className="text-purple-600 font-medium underline">
                登录
              </Link>
            </div>
            
            {/* <FormMessage message={searchParams} /> */}
          </form>
        </div>
      </div>
    </div>
  );
}
