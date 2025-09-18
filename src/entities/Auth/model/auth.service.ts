import { auth } from "@/shared/lib/nextAuth";

export class AuthService {
  static async getSession() {
    return await auth();
  }

  static async getCurrentUser() {
    const session = await this.getSession();
    return session?.user;
  }

  static async requireAuth() {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error("인증이 필요합니다.");
    }
    return user;
  }
}
