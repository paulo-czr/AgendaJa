import { Module } from '@nestjs/common';
import { EmailServico } from './email.service';

@Module({
	providers: [EmailServico],
	exports: [EmailServico],
})
export class EmailModule { }
