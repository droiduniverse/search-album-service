import "reflect-metadata"
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"


@Entity("requests")
export class Request {
    @PrimaryGeneratedColumn()
    request_id : string

    @Column()
    ip_source: string

    @Column()
    artist_name: string

    @Column()
    created_at: string

}