import { ApiProperty } from '@nestjs/swagger'
import { IsLatitude, IsLongitude } from 'class-validator'

export class Location {
  @ApiProperty({ description: 'Latitude', example: 35.7040744 })
  @IsLatitude()
  lat: number

  @ApiProperty({ description: 'Longitude', example: 139.5577317 })
  @IsLongitude()
  lon: number
}

export type StringLocation = `${Location['lat']}, ${Location['lon']}`
