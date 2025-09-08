import { Link } from "lucide-react";

export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            認証エラー
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            認証プロセスでエラーが発生しました。
          </p>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                認証に失敗しました
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  <li>認証コードが無効または期限切れです</li>
                  <li>ネットワーク接続を確認してください</li>
                  <li>しばらく時間をおいてから再度お試しください</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Link
            href="/"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
