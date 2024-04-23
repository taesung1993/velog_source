import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { FormEvent, useState } from "react";
import { login } from "@/lib/services/auth.service";
import { useRouter } from "next/router";
import { useTokenContext } from "@/lib/providers/TokenProvider";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { refetch } = useTokenContext();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password });
      refetch();
      router.replace("/");
    } catch {
      console.error("로그인에 실패했습니다.");
    }
  };

  return (
    <Card className="w-full max-w-[380px] p-8">
      <Heading as="h4">반갑습니다. 👋</Heading>
      <Text as="p" size="5">
        <strong>로그인 폼</strong>입니다.
      </Text>

      <form onSubmit={onSubmit}>
        <Flex direction="column" gap="4" className="mt-5">
          <Box height="40px">
            <TextField.Root
              type="email"
              name="email"
              placeholder="이메일을 입력해주세요."
              className="h-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></TextField.Root>
          </Box>

          <Box height="40px">
            <TextField.Root
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="비밀번호를 입력해주세요"
              className="h-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            >
              <TextField.Slot side="right">
                <IconButton
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </IconButton>
              </TextField.Slot>
            </TextField.Root>
          </Box>

          <Box width="100%" height="40px" mt="2">
            <Button type="submit" className="w-full h-full">
              로그인
            </Button>
          </Box>
        </Flex>
      </form>
    </Card>
  );
}
