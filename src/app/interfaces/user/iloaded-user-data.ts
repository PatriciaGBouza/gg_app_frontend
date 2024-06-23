export interface ILoadedUserData {
  id: number | string;
  name: string;
  email: string;
  image_url?: string;
  password?: string;
  state: string;
}
