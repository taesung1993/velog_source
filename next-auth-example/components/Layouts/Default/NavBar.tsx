import { useTokenContext } from "@/lib/providers/TokenProvider";
import { logout } from "@/lib/services/auth.service";
import { Button, Flex, Separator } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();
  const { ready, isLoggedIn } = useTokenContext();

  const onLogout = async () => {
    try {
      await logout();
      router.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full sticky top-0 left-0 border-b border-b-[#ccc]">
      <div className="w-full max-w-[1440px] h-[60px] mx-auto px-4">
        <nav className="w-full h-full flex items-center justify-between">
          <Flex gap="4" align="center">
            <Link href="/">홈으로 이동</Link>
            <Separator orientation="vertical" />
            <Link href="/user/me">프로필로 이동</Link>
          </Flex>

          {ready && (
            <div>
              {isLoggedIn ? (
                <Button variant="outline" onClick={onLogout}>
                  로그아웃
                </Button>
              ) : (
                <Link href="/sign-in">
                  <Button variant="outline">로그인 / 회원가입</Button>
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
