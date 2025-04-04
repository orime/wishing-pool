import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">登录许愿池</h1>
          
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
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </Label>
                <Link
                  className="text-xs text-purple-600 underline"
                  href="/forgot-password"
                >
                  忘记密码?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="你的密码"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <SubmitButton 
              pendingText="Signing In..." 
              formAction={signInAction}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              登录
            </SubmitButton>
            
            <div className="text-sm text-gray-600 text-center">
              没有账号?{' '}
              <Link href="/sign-up" className="text-purple-600 font-medium underline">
                注册
              </Link>
            </div>
            
            <FormMessage message={searchParams} />
          </form>
        </div>
      </div>
    </div>
  );
}
