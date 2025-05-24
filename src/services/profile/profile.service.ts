import httpInstance from "../config"
import { ProfileProps } from "./profile.service.type"

const profileService = {
  profile: async () => {
    const request = await httpInstance.get<ProfileProps>('/profile')
    if (request.data.error) throw request.data
    return request.data
  }
}

export default profileService