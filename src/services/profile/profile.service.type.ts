import { BaseResponse } from "../base.type"

/**
 * Get Profile
 */

export interface ProfileProps extends BaseResponse {
  data: {
    email: string
  }
}