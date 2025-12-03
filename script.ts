import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// --- FIX __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG ---
const outputDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Replace these with your Google Drive links
const driveLinks = [
'https://drive.google.com/u/1/open?usp=forms_web&id=1_R3HnllKjRY-VcJzHOu845-nsT_Ni6Me',
'https://drive.google.com/u/1/open?usp=forms_web&id=1ZEX9LK0ZASdNnx-pjd_fwUTUQs8LrM9_',
'https://drive.google.com/u/1/open?usp=forms_web&id=1balbqtryXp_g9uOroUpFmh6FXhEF3FS5',
'https://drive.google.com/u/1/open?usp=forms_web&id=1rdC8eXUlU1iJSVu0_6DdzzL_xLQ67_nr',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Sb0jJFgopzcd7YvHCxw7KQCSN478g5eQ',
'https://drive.google.com/u/1/open?usp=forms_web&id=1lsSJnaIF2zMizmOtwu4febyqp-W5iph_',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Uv6P1qtEFQIeR26e-LrTiBE9hsD3fvbD',
'https://drive.google.com/u/1/open?usp=forms_web&id=1-TQE4DBNGT0shMnhU8ZHVILpMKPzBoVG',
'https://drive.google.com/u/1/open?usp=forms_web&id=1DlD7ays4WueO1JDj04OleK2a7aLGaGof',
'https://drive.google.com/u/1/open?usp=forms_web&id=15_HvpOrb6VV-Uek6DBPBaKzAO-_wvuk0',
'https://drive.google.com/u/1/open?usp=forms_web&id=1TCuoxO4-5jcAtrJQ69mpPSbItht0uhMp',
'https://drive.google.com/u/1/open?usp=forms_web&id=1fmh2FLHNMOAmDlBM-169zsDpSPqGpDG-',
'https://drive.google.com/u/1/open?usp=forms_web&id=1_d3bcZeVPE9p5cOD3Cg-tzF92GgY0oYU',
'https://drive.google.com/u/1/open?usp=forms_web&id=1XSV2Vv5AfiqjJ6GU7yUOlD-eXchOXprm',
'https://drive.google.com/u/1/open?usp=forms_web&id=18T_NoGwQDUboODZGCq08DCXtrMkUQMTW',
'https://drive.google.com/u/1/open?usp=forms_web&id=1lmhi-mcc0DTeNu-jcceIY6-FCBpXhEtD',
'https://drive.google.com/u/1/open?usp=forms_web&id=14jyOY2Goyf5lm7ih78duDly9_P_R5uUW',
'https://drive.google.com/u/1/open?usp=forms_web&id=1ecQ0kMP2qxJ8Mb7B7aEH6Q5Q7bo3QS8j',
'https://drive.google.com/u/1/open?usp=forms_web&id=1y3W0ci5_DYyqKh-r1BMzPRc1jYyvzvmO',
'https://drive.google.com/u/1/open?usp=forms_web&id=1ViGQZh9OkQUbruZC9VFr1ARdOKOjuNMW',
'https://drive.google.com/u/1/open?usp=forms_web&id=1pXjJRi1coeKidWCW1qF0pAfQfggYTVgF',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Nj6tr30XDuUs7FlB9m1oOSsGo9UYhrmO',
'https://drive.google.com/u/1/open?usp=forms_web&id=1BE8l_CbWyZSR2c0u0cJANDW_u5bHPs2k',
'https://drive.google.com/u/1/open?usp=forms_web&id=1y46WKovq67Kn0bfVVuBL-zueQbLb2YqI',
'https://drive.google.com/u/1/open?usp=forms_web&id=1kQRkIyQE-Eb4hsIhJ8x2NeQRika-Y4JR',
'https://drive.google.com/u/1/open?usp=forms_web&id=1soW1Di5XjqV6By-egpFpBcc_ilt7t4xh',
'https://drive.google.com/u/1/open?usp=forms_web&id=14PWI9tjGTAEdI4fQDKUm5iOZV1x676zS',
'https://drive.google.com/u/1/open?usp=forms_web&id=11_HKtz1I2RDvYtbjsVOzDvCApoInuakQ',
'https://drive.google.com/u/1/open?usp=forms_web&id=10vcmaC7TsaTVq8joLKsyohMAEWU2PDh7',
'https://drive.google.com/u/1/open?usp=forms_web&id=1g_Wi5zLQTpyEzGfvUvl8xCKbHnQvToQ4',
'https://drive.google.com/u/1/open?usp=forms_web&id=15bNb1rIHzahTRkEu4fJP7XWo4Las1WxN',
'https://drive.google.com/u/1/open?usp=forms_web&id=1NJmehzuhvsCKNxjGBjNFPWnGDjOEZE4s',
'https://drive.google.com/u/1/open?usp=forms_web&id=1WsKdzQFb3YadPLfxsY--SyRKgRJ9ub_3',
'https://drive.google.com/u/1/open?usp=forms_web&id=1xQ5oYQ0Pi58BVMf-n4BqjRqdVYwznR75',
'https://drive.google.com/u/1/open?usp=forms_web&id=14b7p0uSdpPfkqFbioLSF_B8B1ZiioDvo',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Xi8B-OUoEvUWiW8PmQFmABFr9jIu786q',
'https://drive.google.com/u/1/open?usp=forms_web&id=1p1Offx3QtuCouwtAX8XoGVWpvb1WGjWp',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Ypdj4qCShKS9ga-Q6JCITym07X7se6se',
'https://drive.google.com/u/1/open?usp=forms_web&id=1v2eVa083OVgaPJLyIjP1Gtq4ULHkBoLs',
'https://drive.google.com/u/1/open?usp=forms_web&id=1AnuGl79uPPo-TeAjGC2Mowwze53lWWpX',
'https://drive.google.com/u/1/open?usp=forms_web&id=1RQRO3IS0Tm3RIieOWYbcl87p-Ejd0yf-',
'https://drive.google.com/u/1/open?usp=forms_web&id=11vH9XZ5q49NJg8n3V9j4bpG6wFNWsz9v',
'https://drive.google.com/u/1/open?usp=forms_web&id=1sr2aMGkztwXO_i6A0SHPsNvpVoeaqOYc',
'https://drive.google.com/u/1/open?usp=forms_web&id=1J1OlhHzj0DjlTTTvl22ydaArdFLRVlBU',
'https://drive.google.com/u/1/open?usp=forms_web&id=1k_jxVs4EKnth6Po9xC2HxpAp6ZTOeJs1',
'https://drive.google.com/u/1/open?usp=forms_web&id=1PHs_q2ec8Mx0UkVNKfr9W7QLdTGQdcBp',
'https://drive.google.com/u/1/open?usp=forms_web&id=16d8A3DbyKKo2kGT7g389OENZWrUFQ0jj',
'https://drive.google.com/u/1/open?usp=forms_web&id=1t2M4T5jygoPO4ApDMyoDTwSs01CZT4-3',
'https://drive.google.com/u/1/open?usp=forms_web&id=1k_NrLEkldyoK94lpoI3X0UB4nIfHWqOO',
'https://drive.google.com/u/1/open?usp=forms_web&id=1tIFAwlGGo78NLj3XrI4KO5oEFwaQ08yi',
'https://drive.google.com/u/1/open?usp=forms_web&id=1tBI_WNeW6oJKOVWt3a-LXe46Xchl8hnc',
'https://drive.google.com/u/1/open?usp=forms_web&id=1LNVmgcc-jOgzYfL2_HkMY311PIHzScYe',
'https://drive.google.com/u/1/open?usp=forms_web&id=1qd57vl2JUVKAPPL6SHGwa1lA-YA9jhTS',
'https://drive.google.com/u/1/open?usp=forms_web&id=1VRFFklkovG8Pbm3HNYNRUE44ibbqlb9n',
'https://drive.google.com/u/1/open?usp=forms_web&id=1JgXCu4YR8MDCP5QdGxT7YMvGdx7fn0t3',
'https://drive.google.com/u/1/open?usp=forms_web&id=19U9Sdmevww9ChMHs0QNzLjKbBKKAh8L8',
'https://drive.google.com/u/1/open?usp=forms_web&id=1-P2WfbC_2yWa8pFOmYdBo3tXQx0IviaZ',
'https://drive.google.com/u/1/open?usp=forms_web&id=1bBhqRPy-G_Z2c-Ah63gnfb_Fjxgtf-nA',
'https://drive.google.com/u/1/open?usp=forms_web&id=16c05Yb_J1oZIDQjj40quLR39E6icVwu_',
'https://drive.google.com/u/1/open?usp=forms_web&id=1-KnW2-CQgro6dlPYuD8BgB4ObHnNw0kh',
'https://drive.google.com/u/1/open?usp=forms_web&id=1OFsgyprBKGi6DIegeiIwERY_PpNh2owE',
'https://drive.google.com/u/1/open?usp=forms_web&id=17epSB0RX6xKbGjWgP_68hpKiUi8rORuE',
'https://drive.google.com/u/1/open?usp=forms_web&id=1UCzNAnb0ORz5Uj1w6T7e-1R_ZFcjSDZU',
'https://drive.google.com/u/1/open?usp=forms_web&id=1wDxVxC6cXIWFhOGGkXcAatYBtbBgEj5C',
'https://drive.google.com/u/1/open?usp=forms_web&id=1ft08mvBvSwxyFYurmErz7nEzhM9PuOCG',
'https://drive.google.com/u/1/open?usp=forms_web&id=1YKEM8Nb5IdfjuXQzIk2n5n68YXQSm7K8',
'https://drive.google.com/u/1/open?usp=forms_web&id=14gkqEhpVspN39y3itXBnAlThav_Zd4DL',
'https://drive.google.com/u/1/open?usp=forms_web&id=1TI4-MKmySVSSUreO8PHRDJXLjkrlOPLV',
'https://drive.google.com/u/1/open?usp=forms_web&id=1oafD_g3shElIyZ3LY_UhOnEL4BE7Ere-',
'https://drive.google.com/u/1/open?usp=forms_web&id=1oCvz_yJjavomjdnxcbOGNhQBP8LhS5tB',
'https://drive.google.com/u/1/open?usp=forms_web&id=1_NRTHQq0whkYMqd7I9EHqY9XuPndfPEx',
'https://drive.google.com/u/1/open?usp=forms_web&id=1TiThrVw8TIlZ1S73cSQJJn2niDyPJO_q',
'https://drive.google.com/u/1/open?usp=forms_web&id=19epmUEkIQ6s18ofwqEMc7JzOtaOtYo3U',
'https://drive.google.com/u/1/open?usp=forms_web&id=1XG0FxtLssEFDPZHDQ6JTFHJsnJN4Fhd8',
'https://drive.google.com/u/1/open?usp=forms_web&id=1rRD0Kf13j5HS6_aHr-W8er_J0wQgBFBm',
'https://drive.google.com/u/1/open?usp=forms_web&id=16vNb7HjLxCRUvIrNWYOT0JtOjZfmwZOz',
'https://drive.google.com/u/1/open?usp=forms_web&id=1YQ608VIA10frwzT8Qoo3Tz1Dllj72hhn',
'https://drive.google.com/u/1/open?usp=forms_web&id=1zQJiLiXNdaEFURJejvj84IV3S8zzVrsq',
'https://drive.google.com/u/1/open?usp=forms_web&id=1c26Sz0VTYBgVefJlBddZw9r017O9fllB',
'https://drive.google.com/u/1/open?usp=forms_web&id=1N0lD6PYI3ENCu-5LDq63tQZLPzjquw_T',
'https://drive.google.com/u/1/open?usp=forms_web&id=1fKXm7Mdmmt7QZx6r5x2D2rxtcgQcxi_G',
'https://drive.google.com/u/1/open?usp=forms_web&id=19_rDI2JXxNWmsz_o2z4p7hV112ObZ8e-',
'https://drive.google.com/u/1/open?usp=forms_web&id=15F3991OGQRGi0wq5ni7blcyAkTtO5O6t',
'https://drive.google.com/u/1/open?usp=forms_web&id=12TDBzGEBj2a7QYt5wTQi0pnq9ZwNKPRQ',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Ofls9XCYvx0OQd6n_5R0vFID2OglK6SV',
'https://drive.google.com/u/1/open?usp=forms_web&id=1rzLd7JZ-xmt9iK45Y1iOEq2c3Uq1tsHl',
'https://drive.google.com/u/1/open?usp=forms_web&id=1dj5QtOs0wvm1Rft0BXhV2Vp9vFQuoZtz',
'https://drive.google.com/u/1/open?usp=forms_web&id=1ZOHPnrgSDYjMhbuta4jX_-iNtwQQVkrY',
'https://drive.google.com/u/1/open?usp=forms_web&id=1csRk8kMJ3ZWNy7sKAgnrQ4bm8kVHKBWR',
'https://drive.google.com/u/1/open?usp=forms_web&id=1NDF_OwLAjOjRUr_FYceK6LXcsh_9nIZU',
'https://drive.google.com/u/1/open?usp=forms_web&id=1QfcaZKkaPUDF0qiO_qnkOPEIoEdGOR-N',
'https://drive.google.com/u/1/open?usp=forms_web&id=1jX4giPf3kN1824fF5MgPR8-7b5QR9Azc',
'https://drive.google.com/u/1/open?usp=forms_web&id=19wItYHIR0SzVU7lNWdbmadmHAMtcNlAK',
'https://drive.google.com/u/1/open?usp=forms_web&id=1TP1qgOavZRB2QDFzC2covaFMmmITKrKc',
'https://drive.google.com/u/1/open?usp=forms_web&id=1f36GkcYpdlSvGu_pkIGjfF4jovfp19eu',
'https://drive.google.com/u/1/open?usp=forms_web&id=1eeW0DjMJY73t9SV98eNulWJGBzZM4-WM',
'https://drive.google.com/u/1/open?usp=forms_web&id=11xK-WrSQu47YiWhUCzLWVrlc8LEN0NJK',
'https://drive.google.com/u/1/open?usp=forms_web&id=19VM6vbfiKmOn0XExjaStJJWEtajIs-Fi',
'https://drive.google.com/u/1/open?usp=forms_web&id=11ucVUUjenTUjbiCKjCr8wmJC50-p16LM',
'https://drive.google.com/u/1/open?usp=forms_web&id=1wLvTiHx7Jx9FFZ_6apsxLSraBqQYmnl4',
'https://drive.google.com/u/1/open?usp=forms_web&id=1lyGPxRyvyBpaPxOaqqNfNOXs17EZknne',
'https://drive.google.com/u/1/open?usp=forms_web&id=1mjSRBJ3mpbFm_0Q1g7RftMtiak78lYrm',
'https://drive.google.com/u/1/open?usp=forms_web&id=1LGf7QCW4gEknHX3LjXmDPoeK5S1b4IaS',
'https://drive.google.com/u/1/open?usp=forms_web&id=1FRpeiCYOrmb_ibe2xSowlLgY8szz4Frh',
'https://drive.google.com/u/1/open?usp=forms_web&id=1lk4KGlIs_GAWUlLnsn6Ielas1RDR0f1q',
'https://drive.google.com/u/1/open?usp=forms_web&id=1b8c6qpWFtiU1d5wj44jTmQTbVN3GxXB_',
'https://drive.google.com/u/1/open?usp=forms_web&id=1GM4-JG5hU50g4bnDPe0gkP8gFnI9JNIc',
'https://drive.google.com/u/1/open?usp=forms_web&id=1vObLPr_7AIVftEIctpzk0fjwmN19xnlO',
'https://drive.google.com/u/1/open?usp=forms_web&id=1pojxW0rgPtSuJlL_ADzqTqY5Vv29KIUn',
'https://drive.google.com/u/1/open?usp=forms_web&id=1326SCaUSFGkm9CAOfVyAiFcTjwFIx5hy',
'https://drive.google.com/u/1/open?usp=forms_web&id=1SsblY9lYQ1kUly4gIAHz4LkQM2dx7EiZ',
'https://drive.google.com/u/1/open?usp=forms_web&id=1qXaW_pj-YUh9YW01qVZLh2bDp32ma5q6',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Zt2ob1sTLNs8LbDX-8pIvJMdfdtQGM5Q',
'https://drive.google.com/u/1/open?usp=forms_web&id=1NdtVCR1UNcMjUcCfoS_gBcBYyg2owLwB',
'https://drive.google.com/u/1/open?usp=forms_web&id=1TrqRAJF6NgDBU884K6_QtziDoA944Nha',
'https://drive.google.com/u/1/open?usp=forms_web&id=1GGBoFhVjV14SBhGo3yfnqXSzq9TcyLv8',
'https://drive.google.com/u/1/open?usp=forms_web&id=1fdk5UjswVVuPXzWhVx7ZOkLOZMQJCSVQ',
'https://drive.google.com/u/1/open?usp=forms_web&id=1CsKPw4ubkIzM-mjSS-NXwa-Ec3-WloPc',
'https://drive.google.com/u/1/open?usp=forms_web&id=1TOhKGi1gv5xPZglILqqijvGg2yiZ98iG',
'https://drive.google.com/u/1/open?usp=forms_web&id=1oGTIW1IPNO_AfYXvKldjNnm77ezohzqs',
'https://drive.google.com/u/1/open?usp=forms_web&id=1xrmiBHQUuIrgkCATzue7rUlKy80fYP1Q',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Xm1cGSD08TovdmNDTSYxl_XRDvLedfMi',
'https://drive.google.com/u/1/open?usp=forms_web&id=1UTrqB75AnYrkuauUNbuW14QrY3VLpsdJ',
'https://drive.google.com/u/1/open?usp=forms_web&id=1kQ9opWock0Zz-nBHfVRmChnG9zIDOOHE',
'https://drive.google.com/u/1/open?usp=forms_web&id=1B8XjyiHa1KHM8HWiPv5fMTuuDhc8gQdu',
'https://drive.google.com/u/1/open?usp=forms_web&id=1PubYGqvUgi1IV2grAxIzcB8Qlk7ND4MZ',
'https://drive.google.com/u/1/open?usp=forms_web&id=11DLvSGILz0nU79QsQeDFsDC0XT9h47VI',
'https://drive.google.com/u/1/open?usp=forms_web&id=1qY89nWlH5Bl3y4sFqzPPZKPu5KmPNQYv',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Ew5AMcKFb3TFbEccExpPSjJRjQGaYBOO',
'https://drive.google.com/u/1/open?usp=forms_web&id=1VCD94_NQn7e0yYl8zKMJTSjvCivi8gQN',
'https://drive.google.com/u/1/open?usp=forms_web&id=1ErJxxJEHsdq33NzXzL8YcW1Bx-IgRzGb',
'https://drive.google.com/u/1/open?usp=forms_web&id=1NHghR1d0fjD1pr_sV-0Wh4hyfw6VV3Rv',
'https://drive.google.com/u/1/open?usp=forms_web&id=1AQwFL0FRrFdT5Y65ld3L9S91HNdsHIzn',
'https://drive.google.com/u/1/open?usp=forms_web&id=1yg6UAFZ1PTNjCcuTYJ6w_6Pj3GagLhAO',
'https://drive.google.com/u/1/open?usp=forms_web&id=1vWHmgRLnlzG8DZrg7BlouNec2SxzjpSR',
'https://drive.google.com/u/1/open?usp=forms_web&id=1j6-pWATuFjduzsV-8u4KaA3rxhf4CaqD',
'https://drive.google.com/u/1/open?usp=forms_web&id=10xjJhL1vRkyy4w-JESOYS8_CRIFZ5pY1',
'https://drive.google.com/u/1/open?usp=forms_web&id=1mcdHVVT9ZsQDSPbB6nK8cfvVK7FVOLQE',
'https://drive.google.com/u/1/open?usp=forms_web&id=15ac5Gi7VLMEHcAB5tUT49gimJFKTNSRK',
'https://drive.google.com/u/1/open?usp=forms_web&id=1u5O9NON27n6veBnxRuGLUmChhc72Amfh',
'https://drive.google.com/u/1/open?usp=forms_web&id=1OBlGo1_zkb4W_GhdggODJohz-TaCrB_W',
'https://drive.google.com/u/1/open?usp=forms_web&id=1yBds8LGBOF_2kUrUTk1BIToN3s-CU8hO',
'https://drive.google.com/u/1/open?usp=forms_web&id=1CHavSmON10-y1LDEpAm0m2pDzGkKxWD5',
'https://drive.google.com/u/1/open?usp=forms_web&id=1-xKsGTiW0mNm_CbILWt_vVbAFqvb_jrk',
'https://drive.google.com/u/1/open?usp=forms_web&id=1h6RIoL-Sr8WFC2uOsRgog-YJta7TXjAQ',
'https://drive.google.com/u/1/open?usp=forms_web&id=1u9bvrYodPhj3zZwfWq8Y7a6ejGJ379I3',
'https://drive.google.com/u/1/open?usp=forms_web&id=13EtwJZoD2FARArMEm0A029mvl6l2zT3x',
'https://drive.google.com/u/1/open?usp=forms_web&id=1KL_kw1-580iENt-KAye_4OH-cXb7PgKT',
'https://drive.google.com/u/1/open?usp=forms_web&id=1FPPgwMgeW7vctV30MZSSKsPQjihy-YxY',
'https://drive.google.com/u/1/open?usp=forms_web&id=1YvvUBhwa1DO8ki0ahyK-fKxz6vHqLeF7',
'https://drive.google.com/u/1/open?usp=forms_web&id=1Cm26Iq0rmjUcXPrmZt0wZaJHgon-ysLY',
'https://drive.google.com/u/1/open?usp=forms_web&id=1WoG7N16stkp17RfySKdHAiDin6xQcTtN',
'https://drive.google.com/u/1/open?usp=forms_web&id=1kPjUbcK1ULTSdSgPe4gPZVhrmIcio8bT',
'https://drive.google.com/u/1/open?usp=forms_web&id=1UHRFEaO3OmwhAdgpH_Bl9BQDrPTWAR7p',
'https://drive.google.com/u/1/open?usp=forms_web&id=1ibRdEM6phBrhrMrNajqxaaLUqWes04Fa',
'https://drive.google.com/u/1/open?usp=forms_web&id=1hLYZABCF2clA0wWmxRtQzoCb3kBaPEtA',
'https://drive.google.com/u/1/open?usp=forms_web&id=1hOYt51klKBg-vKrhthgThJylOMlZl-Sp',
'https://drive.google.com/u/1/open?usp=forms_web&id=1MnMbr68QFeCFFHeTE5enzE2U-pRGjjGW',
'https://drive.google.com/u/1/open?usp=forms_web&id=1GBXdsDRulMQm6peUBgeNEJ9ifY711OPF',
'https://drive.google.com/u/1/open?usp=forms_web&id=1HJEohahaok4Tbl5Olji5cUP8pX3-7F-_',
'https://drive.google.com/u/1/open?usp=forms_web&id=1wcwKgpgijufqBYLcX9qIav4G3OE7NAVl',
'https://drive.google.com/u/1/open?usp=forms_web&id=16HaZ23sttdGFwKH3GagqD9Ua7K1j4aY7',
'https://drive.google.com/u/1/open?usp=forms_web&id=1-xYztC24VL4iXwUVD29vmXie2Tu1SH4L',
'https://drive.google.com/u/1/open?usp=forms_web&id=1K-pIBN9j1FcnB5kYWGG4gTlPSaeG09CK',
'https://drive.google.com/u/1/open?usp=forms_web&id=1NGf2tk-fyvVBLIg_PPAv9e9tBk411Joe',
'https://drive.google.com/u/1/open?usp=forms_web&id=1tVQFeBX7wYktPOFKgtV32dLV3kGpmcLY',
'https://drive.google.com/u/1/open?usp=forms_web&id=1sBmOlLf4-_SADwKNNRSkvztD61hkYtfT',
'https://drive.google.com/u/1/open?usp=forms_web&id=1JwsL_A3efEFalcJtMPM5PYvRcG6G6wck',
'https://drive.google.com/u/1/open?usp=forms_web&id=1BdSFQewH3MU5W2ajXsnU39Jso4Qs1qA-',
'https://drive.google.com/u/1/open?usp=forms_web&id=1rg5aW6LDHJ9VNFsBBgrrGURNx1PctM1L',
'https://drive.google.com/u/1/open?usp=forms_web&id=1yRrnjLwwbZe-g2FxUF-U5jIw3J4wCOE8',
'https://drive.google.com/u/1/open?usp=forms_web&id=1a-TqZWpQfnQ_YyPVUIKESmcw1lCSiheZ',
'https://drive.google.com/u/1/open?usp=forms_web&id=174BWzz7MCB-YOoLnURQ87wOhUbHCtUbh',
'https://drive.google.com/u/1/open?usp=forms_web&id=11QMRmqlQ4vcqLl6p6lzzUn-NUyxrB1a9',
'https://drive.google.com/u/1/open?usp=forms_web&id=1TMnVrB-9uwmdy5-RPLvA1ftpQ5spIl5p',
'https://drive.google.com/u/1/open?usp=forms_web&id=1aFaT_FrerwSWQUDXv1lQ8r7_xeLY3K6N',
'https://drive.google.com/u/1/open?usp=forms_web&id=1IYuVCDB5fXjbyTGWM7q2LNVTqBbTqcyN',
'https://drive.google.com/u/1/open?usp=forms_web&id=1XQy3G-8Adjybc41n8jZzK7KumnnxnIUR',
];

// Helper: Extract file ID from Google Drive URL
function getFileId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Download a single file
async function downloadFile(fileId: string, fileName: string) {
  try {
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, res.data);
    console.log(`Downloaded: ${fileName}`);
  } catch (err) {
    console.error(`Failed to download ${fileName}:`, err.message);
  }
}

// Main
(async () => {
  for (const link of driveLinks) {
    const fileId = getFileId(link);
    if (!fileId) {
      console.warn(`Invalid Drive link: ${link}`);
      continue;
    }

    const fileName = `${fileId}.jpg`;
    await downloadFile(fileId, fileName);
  }
})();
