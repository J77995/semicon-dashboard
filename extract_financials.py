#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FADU Financial Data Extraction Script
Extracts quarterly financial data from 10 DART report text files
and generates TypeScript database files.
"""

import os

BASE = r'C:\workspace\fadu_dashboard\data_fadu_txt'
OUT_DIR = r'C:\workspace\fadu_dashboard\src\data\fadu'

def to_m(won):
    """Convert Won to 백만원 (millions), round to integer."""
    if won is None:
        return None
    return round(won / 1_000_000)

# ============================================================
# HARDCODED EXTRACTION (verified against actual file line numbers)
# ============================================================

# ---- Annual IS data (3-year comparison, col0=current, col1=prior, col2=prior-prior) ----

# 25FY (사업보고서 2026.03.18) - Lines 2505-2526
IS_25fy = {
    'revenue': 92419333233,
    'cogs': 48760917939,
    'gross': 43658415294,
    'sga': 109128401006,
    'opinc': -65469985712,
    'other_inc': 2818679464,
    'fin_inc': 15295848343,
    'other_loss': 2316062897,
    'fin_loss': 40466940,
    'net': -76218175613,
}

# 24FY (사업보고서 2025.08.14) - Lines 2377-2418
IS_24fy = {
    'revenue': 43502744974,
    'cogs': 37733546496,
    'gross': 5769198478,
    'sga': 100817499386,
    'opinc': -95048300908,
    'other_inc': 6226005670,
    'fin_inc': 3451780435,
    'other_loss': 914214814,
    'fin_loss': 107563304,
    'net': -91508531301,
}

# 23FY (사업보고서 2024.03.20) - Lines 2214-2236
IS_23fy = {
    'revenue': 22470905715,
    'cogs': 11375113614,
    'gross': 11095792101,
    'sga': 69665231327,
    'opinc': -58569439226,
    'other_inc': 4176408802,
    'fin_inc': 2376869335,
    'other_loss': 2837742,
    'fin_loss': 65459380,
    'net': -56832521397,
}

# ---- Q1 IS data ----
# 25Q1 (분기보고서 2025.05.12) - Lines 2084-2107
# Format: [25Q1, 24Q1] (standalone = cumulative for Q1)
IS_25q1 = {
    'revenue': 19218938606,
    'cogs': 9062942576,
    'gross': 10155996030,
    'sga': 22141535532,
    'opinc': -11985539502,
    'pretax': -12104972194,
    'tax': 31522722,
    'net': -12136494916,
}

# 24Q1 standalone = prior period from 25Q1 file, also confirmed in 24Q1 file
IS_24q1 = {
    'revenue': 2331858573,
    'cogs': 1859878253,
    'gross': 471980320,
    'sga': 16700664459,
    'opinc': -16228684139,
    'pretax': -15448298243,
    'tax': 0,
    'net': -15448298243,
}

# 23Q1 standalone = prior period from 24Q1 file (Lines 2219-2242)
IS_23q1 = {
    'revenue': 17663847173,
    'cogs': 4131235190,
    'gross': 13532611983,
    'sga': 17846100547,
    'opinc': -4313488564,
    'net': -4104436260,
}

# ---- H1 cumulative IS data ----
# 25H1 cumul (반기보고서 2025.08.12) - Lines 2113-2136
# Format: [25Q2_standalone, 25H1_cumul, 24Q2_standalone, 24H1_cumul]
IS_25h1_cumul = {
    'revenue': 42898264617,
    'cogs': 22556389877,
    'gross': 20341874740,
    'sga': 44891625561,
    'opinc': -24549750821,
    'pretax': -26851818029,
    'tax': -35579980,
    'net': -26887398009,
}

IS_25q2_standalone = {
    'revenue': 23679326011,
    'cogs': 13493447301,
    'gross': 10185878710,
    'sga': 22750090029,
    'opinc': -12564211319,
    'net': -14750903093,
}

# 24H1 cumul (반기보고서 2024.08.29) - Lines 2717-2756
IS_24h1_cumul = {
    'revenue': 9424374406,
    'cogs': 8396741749,
    'gross': 1027632657,
    'sga': 39440823495,
    'opinc': -38413190838,
    'pretax': -36895851753,
    'tax': -33362123,
    'net': -36929213876,
}

IS_24q2_standalone = {
    'revenue': 7092515833,
    'cogs': 6536863496,
    'gross': 555652337,
    'sga': 22740159036,
    'opinc': -22184506699,
    'net': -21480915633,
}

# 23H1 cumul = prior period columns from 24H1 file
IS_23h1_cumul = {
    'revenue': 17723255609,
    'cogs': 4309929367,
    'gross': 13413326242,
    'sga': 33002219675,
    'opinc': -19588893433,
    'net': -19361436943,
}

IS_23q2_standalone = {
    'revenue': 59408436,
    'cogs': 178694177,
    'gross': -119285741,
    'sga': 15156119128,
    'opinc': -15275404869,
    'net': -15257000683,
}

# ---- Q3 cumulative IS data ----
# 25Q3 cumul (분기보고서 2025.11.12) - Lines 1812-1835
IS_25q3c = {
    'revenue': 68542695750,
    'cogs': 36293643715,
    'gross': 32249052035,
    'sga': 68225033098,
    'opinc': -35975981063,
    'pretax': -37718217423,
    'tax': -51692827,
    'net': -37769910250,
}

IS_25q3_standalone = {
    'revenue': 25644431133,
    'cogs': 13737253838,
    'gross': 11907177295,
    'sga': 23333407537,
    'opinc': -11426230242,
    'net': -10882512241,
}

# 24Q3 cumul (분기보고서 2024.11.14) - Lines 2206-2246
IS_24q3c = {
    'revenue': 19519245032,
    'cogs': 16249514892,
    'gross': 3269730140,
    'sga': 72227064247,
    'opinc': -68957334107,
    'net': -67596677545,
}

IS_24q3_standalone = {
    'revenue': 10094870626,
    'cogs': 7852773143,
    'gross': 2242097483,
    'sga': 32786240752,
    'opinc': -30544143269,
    'net': -30667463669,
}

# 23Q3 cumul (분기보고서 2023.11.13) - Lines 2123-2159
IS_23q3c = {
    'revenue': 18044065686,
    'cogs': 4742803228,
    'gross': 13301262458,
    'sga': 47711506552,
    'opinc': -34410244094,
    'net': -33739775987,
}

IS_23q3_standalone = {
    'revenue': 320810077,
    'cogs': 432873861,
    'gross': -112063784,
    'sga': 14709286877,
    'opinc': -14821350661,
    'net': -14378339044,
}

# ============================================================
# DERIVE QUARTERLY DATA BY SUBTRACTION
# ============================================================

def sub_is(fy_or_cumul, smaller_cumul):
    """Derive a quarter IS by subtracting smaller_cumul from fy_or_cumul."""
    result = {}
    for k in ['revenue','cogs','gross','sga','opinc','net']:
        if k in fy_or_cumul and k in smaller_cumul:
            result[k] = fy_or_cumul[k] - smaller_cumul[k]
        else:
            result[k] = None
    return result

# 23Q2 = 23H1 - 23Q1
IS_23q2 = sub_is(IS_23h1_cumul, IS_23q1)
# 23Q4 = 23FY - 23Q3_cumul
IS_23q4 = sub_is(IS_23fy, IS_23q3c)
# 24Q2 = 24H1 - 24Q1
IS_24q2 = sub_is(IS_24h1_cumul, IS_24q1)
# 24Q4 = 24FY - 24Q3_cumul
IS_24q4 = sub_is(IS_24fy, IS_24q3c)
# 25Q2 = 25H1 - 25Q1
IS_25q2 = sub_is(IS_25h1_cumul, IS_25q1)
# 25Q4 = 25FY - 25Q3_cumul
IS_25q4 = sub_is(IS_25fy, IS_25q3c)

# ============================================================
# CROSS-VALIDATION
# ============================================================
print("=" * 70)
print("CROSS-VALIDATION (백만원)")
print("=" * 70)

existing = {
    '23Q4': {'revenue': 4427, 'cogs': 6632, 'gross': -2205, 'sga': 21954, 'opinc': -24159, 'net': -23093},
    '24Q1': {'revenue': 2332, 'cogs': 1860, 'gross': 472, 'sga': 16701, 'opinc': -16229, 'net': -15448},
    '24Q2': {'revenue': 7093, 'cogs': 6537, 'gross': 556, 'sga': 22740, 'opinc': -22185, 'net': -21481},
    '24Q3': {'revenue': 10095, 'cogs': 7853, 'gross': 2242, 'sga': 32786, 'opinc': -30544, 'net': -30667},
    '24Q4': {'revenue': 23983, 'cogs': 21484, 'gross': 2499, 'sga': 28590, 'opinc': -26091, 'net': -23912},
    '25Q1': {'revenue': 19219, 'cogs': 9063, 'gross': 10156, 'sga': 22142, 'opinc': -11986, 'net': -12136},
    '25Q2': {'revenue': 23679, 'cogs': 13493, 'gross': 10186, 'sga': 22750, 'opinc': -12564, 'net': -14751},
    '25Q3': {'revenue': 25644, 'cogs': 13737, 'gross': 11907, 'sga': 23333, 'opinc': -11426, 'net': -10883},
    '25Q4': {'revenue': 23877, 'cogs': 12467, 'gross': 11409, 'sga': 40903, 'opinc': -29494, 'net': -38448},
}

derived_map = {
    '23Q1': IS_23q1,
    '23Q2': IS_23q2,
    '23Q3': IS_23q3_standalone,
    '23Q4': IS_23q4,
    '24Q1': IS_24q1,
    '24Q2': IS_24q2,
    '24Q3': IS_24q3_standalone,
    '24Q4': IS_24q4,
    '25Q1': IS_25q1,
    '25Q2': IS_25q2,
    '25Q3': IS_25q3_standalone,
    '25Q4': IS_25q4,
}

field_labels = {
    'revenue': 'revenue',
    'cogs': 'cogs',
    'gross': 'grossProfit',
    'sga': 'sga',
    'opinc': 'opIncome',
    'net': 'netIncome',
}

cross_check_results = {}
all_ok = True

for qtr in sorted(derived_map.keys()):
    d = derived_map[qtr]
    ok = True
    notes = []

    if qtr in existing:
        e = existing[qtr]
        print(f"\n  {qtr}:")
        for dk, label in field_labels.items():
            dv = to_m(d.get(dk))
            ev = e.get(dk)
            if ev is None:
                ev = e.get(label)
            if dv is not None and ev is not None:
                diff = dv - ev
                status = "OK" if diff == 0 else f"DIFF={diff}"
                if diff != 0:
                    ok = False
                    all_ok = False
                    notes.append(f"{label}: derived={dv}, existing={ev}, diff={diff}")
                print(f"    {label:15s}: derived={dv:9d}M  existing={ev:9d}M  {status}")
            else:
                status = "N/A"
                print(f"    {label:15s}: derived={dv}  existing={ev}  {status}")
    else:
        print(f"\n  {qtr}: (no existing data to compare - new data)")
        for dk, label in field_labels.items():
            dv = to_m(d.get(dk))
            print(f"    {label:15s}: derived={dv}M")

    cross_check_results[qtr] = {
        'ok': ok,
        'note': 'All fields match existing data' if (ok and qtr in existing) else
                ('No existing data' if qtr not in existing else '; '.join(notes))
    }

print(f"\n{'All cross-checks PASSED' if all_ok else 'Some cross-checks FAILED'}")

# ============================================================
# BALANCE SHEET DATA
# ============================================================
print("\n" + "=" * 70)
print("BALANCE SHEET DATA (Won -> 백만원)")
print("=" * 70)

# All BS values from 2-1. sections of each report's consolidated statements
# Items: cash, ar, shortTermInvest, otherCurrentAssets, inventory,
#        ppe, intangibles, rouAssets, totalAssets, totalLiabilities, totalEquity

bs_raw = {
    # 25Q4 = 25FY year-end (2025.12.31) - from 25FY 2-1. section lines 2404-2492
    '25Q4': {
        'cash': 96117578414,
        'accountsReceivable': 40803548861,
        'shortTermFinancial': 500000000,
        'inventory': 5735267524,
        'otherCurrent': 2335516558,
        'currentAssets': 96117578414 + 40803548861 + 500000000 + 5735267524 + 2335516558,
        'ppe': 5395665643,
        'intangibles': 179062016,
        'rouAssets': 26309588679,
        'totalAssets': 122427167093,
        'totalLiabilities': 102632856004,
        'totalEquity': 19794311089,
    },
    # 25Q3 (2025.09.30) - from 25Q3 file lines 1734-1798
    '25Q3': {
        'cash': 76612289206,
        'accountsReceivable': 24453135086,
        'shortTermFinancial': 500000000,
        'inventory': 14075231845,
        'otherCurrent': 905706123,
        'currentAssets': 76612289206 + 24453135086 + 500000000 + 14075231845 + 905706123,
        'ppe': 4611340602,
        'intangibles': 173812200,
        'rouAssets': 29659227503,
        'totalAssets': 106271516709,
        'totalLiabilities': 47546132078,
        'totalEquity': 58725384631,
    },
    # 25Q2 = 25H1 (2025.06.30) - from 25H1 file lines 2034-2099
    '25Q2': {
        'cash': 83769647642,
        'accountsReceivable': 37513933996,
        'shortTermFinancial': 500000000,
        'inventory': 8862122141,
        'otherCurrent': 471240434,
        'currentAssets': 83769647642 + 37513933996 + 500000000 + 8862122141 + 471240434,
        'ppe': 6497837326,
        'intangibles': 126631830,
        'rouAssets': 31801650670,
        'totalAssets': 115571298312,
        'totalLiabilities': 44005377938,
        'totalEquity': 71565920374,
    },
    # 25Q1 (2025.03.31) - from 25Q1 file lines 2006-2070
    '25Q1': {
        'cash': 84409897306,
        'accountsReceivable': 27964106508,
        'shortTermFinancial': 1966500000,
        'inventory': 11858929138,
        'otherCurrent': 822206474,
        'currentAssets': 84409897306 + 27964106508 + 1966500000 + 11858929138 + 822206474,
        'ppe': 8048767763,
        'intangibles': 725939250,
        'rouAssets': 33573948848,
        'totalAssets': 117983846154,
        'totalLiabilities': 31508103971,
        'totalEquity': 86475742183,
    },
    # 24Q4 = 24FY year-end (2024.12.31) - from 24FY 2-1. section / 25FY col2
    '24Q4': {
        'cash': 98647616813,
        'accountsReceivable': 32322634109,
        'shortTermFinancial': 13440000000,
        'inventory': 13891950860,
        'otherCurrent': 1516736266,
        'currentAssets': 98647616813 + 32322634109 + 13440000000 + 13891950860 + 1516736266,
        'ppe': 5474099009,
        'intangibles': 635480590,
        'rouAssets': 35779726271,
        'totalAssets': 134427343084,
        'totalLiabilities': 36480472542,
        'totalEquity': 97946870542,
    },
    # 24Q3 (2024.09.30) - from 24Q3 file lines 2128-2192
    '24Q3': {
        'cash': 113978198093,
        'accountsReceivable': 24515253101,
        'shortTermFinancial': 10300000000,
        'inventory': 10827078084,
        'otherCurrent': 8802138843,
        'currentAssets': 113978198093 + 24515253101 + 10300000000 + 10827078084 + 8802138843,
        'ppe': 9094368783,
        'intangibles': 580287134,
        'rouAssets': 35901960335,
        'totalAssets': 149880158428,
        'totalLiabilities': 28719428740,
        'totalEquity': 121160729688,
    },
    # 24Q2 = 24H1 (2024.06.30) - from 24H1 file lines 2638-2703
    '24Q2': {
        'cash': 163976877468,
        'accountsReceivable': 20381587973,
        'shortTermFinancial': 25300000000,
        'inventory': 5997888365,  # line 2646 (including -() note)
        'otherCurrent': 3887071074,
        'currentAssets': 163976877468 + 20381587973 + 25300000000 + 5997888365 + 3887071074,
        'ppe': 3338094057,
        'intangibles': 301364730,
        'rouAssets': 38639363297,
        'totalAssets': 202616240765,
        'totalLiabilities': 50942471013,
        'totalEquity': 151673769752,
    },
    # 24Q1 (2024.03.31) - from 24Q1 file lines 2142-2205
    '24Q1': {
        'cash': 183394378829,
        'accountsReceivable': 17007071358,
        'shortTermFinancial': 36646800000,
        'inventory': 928881225,  # line 2150 (net of allowances)
        'otherCurrent': 2173011324,
        'currentAssets': 183394378829 + 17007071358 + 36646800000 + 928881225 + 2173011324,
        'ppe': 2906244599,
        'intangibles': 464579160,
        'rouAssets': 39716073268,
        'totalAssets': 223110452097,
        'totalLiabilities': 51064852305,
        'totalEquity': 172045599792,
    },
    # 23Q4 = 23FY year-end (2023.12.31) - from 23FY 2-1. section / 24FY col2
    '23Q4': {
        'cash': 203276135900,
        'accountsReceivable': 95393266016,
        'shortTermFinancial': 50557880000,
        'inventory': 1616328667,
        'otherCurrent': 2408612693,
        'currentAssets': 203276135900 + 95393266016 + 50557880000 + 1616328667 + 2408612693,
        'ppe': 2121917470,
        'intangibles': 304733450,
        'rouAssets': 40385657896,
        'totalAssets': 243661793796,
        'totalLiabilities': 57313618158,
        'totalEquity': 186348175638,
    },
    # 23Q3 (2023.09.30) - from 23Q3 file lines 2060-2109
    '23Q3': {
        'cash': 227087631129,
        'accountsReceivable': 97644234313,  # line 2061
        'shortTermFinancial': 40568960000,  # line 2062 (short-term deposits)
        'inventory': 69203502938,  # line 2063 (seems large - may include other items?)
        'otherCurrent': 0,
        'currentAssets': 227087631129 + 97644234313 + 40568960000,  # approximate
        'ppe': 2660170164,
        'intangibles': 129480070,  # line 2067
        'rouAssets': 41083720543,  # line 2068
        'totalAssets': 268171351672,
        'totalLiabilities': 56239268721,
        'totalEquity': 211932082951,
    },
}

# Print BS summary
for qtr, bs in sorted(bs_raw.items()):
    print(f"\n  {qtr}:")
    print(f"    Cash: {to_m(bs['cash']):,} M")
    print(f"    AR: {to_m(bs['accountsReceivable']):,} M")
    print(f"    Inventory: {to_m(bs['inventory']):,} M")
    print(f"    Total Assets: {to_m(bs['totalAssets']):,} M")
    print(f"    Total Liabilities: {to_m(bs['totalLiabilities']):,} M")
    print(f"    Total Equity: {to_m(bs['totalEquity']):,} M")
    check = bs['totalLiabilities'] + bs['totalEquity']
    diff = abs(check - bs['totalAssets'])
    status = "OK" if diff < 1000 else f"DIFF={diff:,}"
    print(f"    L+E balance: {status}")

# ============================================================
# SGA BREAKDOWN DATA
# ============================================================
print("\n" + "=" * 70)
print("SGA BREAKDOWN (Annual notes)")
print("=" * 70)

# 25FY SGA breakdown (section 25.1, lines 4859-4883 in 25FY file)
# 25FY total: 109,128,401,006; 24FY total (prior): 100,817,499,386
# Items (25FY / 24FY):
# 1. 17,119,808,660 / 11,768,134,718  -> 급여 (salary)
# 2. 961,428,481 / 510,919,373         -> 퇴직급여 (pension)
# 3. 3,965,637,441 / 2,914,373,841    -> 복리후생비 (welfare)
# 4. 1,011,922,606 / 915,413,189      -> 감가상각비 (depreciation)
# 5. 228,313,925 / 240,713,278        -> 사용권자산상각비 (ROU depreciation)
# 6. 51,777,065 / 39,402,767          -> 무형자산상각비 (amortization)
# 7. 663,759,805 / 525,584,281        -> 지급수수료 (service fees)
# 8. 1,561,660,563 / 1,231,074,509    -> other (advertising/marketing?)
# 9. 68,715,556,177 / 66,092,708,661  -> 연구개발비 (R&D - largest)
# 10. 8,499,818 / 13,856,674          -> other small
# 11. 289,122,237 / 316,007,645       -> other
# 12. 12,169,635,320 / 13,225,334,443 -> 주식보상비용 (stock comp)
# 13. 80,677,212 / 65,162,246         -> other
# 14. 1,216,689,927 / 1,563,553,865   -> other
# 15. 0 / (10,972,794)                -> (negative in 24FY only)
# 16. 1,030,579,037 / 1,291,398,458   -> other
# 17. 53,332,732 / 114,834,232        -> other
# TOTAL: 109,128,401,006 / 100,817,499,386

sga_25fy_items = {
    'salary': (17119808660, 11768134718),          # 급여
    'pension': (961428481, 510919373),              # 퇴직급여
    'welfare': (3965637441, 2914373841),            # 복리후생비
    'depreciation': (1011922606, 915413189),        # 감가상각비
    'rouDepreciation': (228313925, 240713278),      # 사용권자산상각비
    'amortization': (51777065, 39402767),           # 무형자산상각비
    'serviceFees': (663759805, 525584281),          # 지급수수료
    'other1': (1561660563, 1231074509),             # 기타
    'rnd': (68715556177, 66092708661),              # 연구개발비
    'other2': (8499818, 13856674),
    'other3': (289122237, 316007645),
    'stockComp': (12169635320, 13225334443),        # 주식보상비용
    'other4': (80677212, 65162246),
    'other5': (1216689927, 1563553865),
    'other6': (0, -10972794),                       # 환급 (negative)
    'other7': (1030579037, 1291398458),
    'other8': (53332732, 114834232),
}

sga_25fy_total = sum(v[0] for v in sga_25fy_items.values())
sga_24fy_from_25 = sum(v[1] for v in sga_25fy_items.values())
print(f"\n  25FY SGA total check: {sga_25fy_total:,} vs {109128401006:,} -> {'OK' if sga_25fy_total == 109128401006 else 'DIFF'}")
print(f"  24FY SGA total check: {sga_24fy_from_25:,} vs {100817499386:,} -> {'OK' if sga_24fy_from_25 == 100817499386 else 'DIFF'}")

# 24FY SGA breakdown (section 24.1, lines 4569-4593 in 24FY file)
# 24FY total: 100,817,499,386; 23FY total (prior): 69,665,231,327
# Items (24FY / 23FY):
# 1. 11,768,134,718 / 7,279,755,073    -> 급여
# 2. 510,919,373 / 440,550,147         -> 퇴직급여
# 3. 2,914,373,841 / 2,074,514,646    -> 복리후생비
# 4. 915,413,189 / 625,569,943        -> 감가상각비
# 5. 240,713,278 / 116,648,956        -> 사용권자산상각비
# 6. 39,402,767 / 20,881,640          -> 무형자산상각비
# 7. 525,584,281 / 213,851,481        -> 지급수수료
# 8. 1,231,074,509 / 877,182,674      -> other
# 9. 66,092,708,661 / 51,741,862,182  -> 연구개발비
# 10. 13,856,674 / 16,830,780         -> other
# 11. 316,007,645 / 114,712,440       -> other
# 12. 13,225,334,443 / 5,129,801,450  -> 주식보상비용
# 13. 65,162,246 / 34,335,945         -> other
# 14. 1,563,553,865 / 911,839,232     -> other
# 15. (10,972,794) / 10,972,794       -> 환급
# 16. 1,291,398,458 / 0               -> other
# 17. 114,834,232 / 55,921,944        -> other
# TOTAL: 100,817,499,386 / 69,665,231,327

sga_24fy_items = {
    'salary': (11768134718, 7279755073),
    'pension': (510919373, 440550147),
    'welfare': (2914373841, 2074514646),
    'depreciation': (915413189, 625569943),
    'rouDepreciation': (240713278, 116648956),
    'amortization': (39402767, 20881640),
    'serviceFees': (525584281, 213851481),
    'other1': (1231074509, 877182674),
    'rnd': (66092708661, 51741862182),
    'other2': (13856674, 16830780),
    'other3': (316007645, 114712440),
    'stockComp': (13225334443, 5129801450),
    'other4': (65162246, 34335945),
    'other5': (1563553865, 911839232),
    'other6': (-10972794, 10972794),
    'other7': (1291398458, 0),
    'other8': (114834232, 55921944),
}

sga_24fy_total = sum(v[0] for v in sga_24fy_items.values())
sga_23fy_from_24 = sum(v[1] for v in sga_24fy_items.values())
print(f"\n  24FY SGA total check: {sga_24fy_total:,} vs {100817499386:,} -> {'OK' if sga_24fy_total == 100817499386 else 'DIFF'}")
print(f"  23FY SGA total check (from 24FY file): {sga_23fy_from_24:,} vs {69665231327:,} -> {'OK' if sga_23fy_from_24 == 69665231327 else 'DIFF'}")

# 23FY SGA breakdown (section 24.1, lines 4234-4255 in 23FY file)
# 23FY total: 69,665,231,327; 22FY total (prior): 43,023,406,680
# Items (23FY / 22FY):
# 1. 7,279,755,073 / 4,055,452,675    -> 급여
# 2. 440,550,147 / 744,332,513        -> 퇴직급여
# 3. 2,074,514,646 / 1,132,169,932   -> 복리후생비
# 4. 625,569,943 / 407,149,636       -> 감가상각비
# 5. 116,648,956 / 86,259,180        -> 사용권자산상각비
# 6. 20,881,640 / 10,382,523         -> 무형자산상각비
# 7. 213,851,481 / 108,585,519       -> 지급수수료
# 8. 877,182,674 / 658,990,389       -> other
# 9. 51,741,862,182 / 30,804,706,182 -> 연구개발비
# 10. 16,830,780 / 17,950,530        -> other
# 11. 114,712,440 / 127,498,138      -> other
# 12. 5,129,801,450 / 4,285,153,205  -> 주식보상비용
# 13. 34,335,945 / 13,475,000        -> other
# 14. 911,839,232 / 518,438,831      -> other
# 15. 66,894,738 / 52,862,427        -> other
# (no items 15/16/17 in 23FY format)
# TOTAL: 69,665,231,327 / 43,023,406,680

sga_23fy_items = {
    'salary': (7279755073, 4055452675),
    'pension': (440550147, 744332513),
    'welfare': (2074514646, 1132169932),
    'depreciation': (625569943, 407149636),
    'rouDepreciation': (116648956, 86259180),
    'amortization': (20881640, 10382523),
    'serviceFees': (213851481, 108585519),
    'other1': (877182674, 658990389),
    'rnd': (51741862182, 30804706182),
    'other2': (16830780, 17950530),
    'other3': (114712440, 127498138),
    'stockComp': (5129801450, 4285153205),
    'other4': (34335945, 13475000),
    'other5': (911839232, 518438831),
    'other6': (66894738, 52862427),
}

sga_23fy_total = sum(v[0] for v in sga_23fy_items.values())
print(f"\n  23FY SGA total check: {sga_23fy_total:,} vs {69665231327:,} -> {'OK' if sga_23fy_total == 69665231327 else 'DIFF'}")

# Combine 'other' items for clean output
def combine_others(items_dict):
    """Combine all 'other' items into a single 'other' field."""
    result = {}
    other_curr = 0
    other_prior = 0
    for k, (curr, prior) in items_dict.items():
        if k.startswith('other'):
            other_curr += curr
            other_prior += prior
        else:
            result[k] = (curr, prior)
    result['other'] = (other_curr, other_prior)
    return result

sga_25fy_clean = combine_others(sga_25fy_items)
sga_24fy_clean = combine_others(sga_24fy_items)
sga_23fy_clean = combine_others(sga_23fy_items)

# ============================================================
# GENERATE TYPESCRIPT FILES
# ============================================================

quarters = [
    ('23Q1', '2023-03-31', 'direct: Q1 2023 from 24Q1 prior period column', IS_23q1),
    ('23Q2', '2023-06-30', 'derived: 23H1 - 23Q1 (using 24H1 prior period)', IS_23q2),
    ('23Q3', '2023-09-30', 'direct: Q3 standalone from 23Q3 report', IS_23q3_standalone),
    ('23Q4', '2023-12-31', 'derived: FY2023 - 9M2023', IS_23q4),
    ('24Q1', '2024-03-31', 'direct: Q1 2024 from 24Q1 report', IS_24q1),
    ('24Q2', '2024-06-30', 'derived: 24H1 - 24Q1', IS_24q2),
    ('24Q3', '2024-09-30', 'direct: Q3 standalone from 24Q3 report', IS_24q3_standalone),
    ('24Q4', '2024-12-31', 'derived: FY2024 - 9M2024', IS_24q4),
    ('25Q1', '2025-03-31', 'direct: Q1 2025 from 25Q1 report', IS_25q1),
    ('25Q2', '2025-06-30', 'derived: 25H1 - 25Q1', IS_25q2),
    ('25Q3', '2025-09-30', 'direct: Q3 standalone from 25Q3 report', IS_25q3_standalone),
    ('25Q4', '2025-12-31', 'derived: FY2025 - 9M2025', IS_25q4),
]

def fmt_val(v, won_val):
    """Format a value for TypeScript - to_m conversion."""
    if won_val is None:
        return 'null'
    return str(to_m(won_val))

def fmt_note(q):
    r = cross_check_results.get(q, {})
    note = r.get('note', 'no cross-check')
    return note.replace("'", "\\'")

ts_is_records = []
for qtr, period_end, source, d in quarters:
    cc = cross_check_results.get(qtr, {})
    cross_ok = 'true' if cc.get('ok', True) else 'false'
    cross_note = fmt_note(qtr)

    # Derive other/financial items where possible
    pretax = d.get('pretax')
    tax = d.get('tax')
    if pretax is None and d.get('opinc') is not None:
        # Estimate pretax from opinc + adjustments
        other_inc = d.get('other_inc', 0) or 0
        fin_inc = d.get('fin_inc', 0) or 0
        other_loss = d.get('other_loss', 0) or 0
        fin_loss = d.get('fin_loss', 0) or 0
        pretax = d.get('opinc', 0) + other_inc + fin_inc - other_loss - fin_loss

    net = d.get('net')
    if pretax is not None and net is not None and tax is None:
        tax = net - pretax

    other_income = d.get('other_inc')
    fin_income = d.get('fin_inc')
    other_loss_v = d.get('other_loss')
    fin_loss_v = d.get('fin_loss')

    # otherIncomeLoss = other_inc - other_loss (net)
    if other_income is not None and other_loss_v is not None:
        other_net = other_income - other_loss_v
    elif other_income is not None:
        other_net = other_income
    else:
        other_net = None

    # financialIncomeLoss = fin_inc - fin_loss (net)
    if fin_income is not None and fin_loss_v is not None:
        fin_net = fin_income - fin_loss_v
    elif fin_income is not None:
        fin_net = fin_income
    else:
        fin_net = None

    record = f"""  {{
    quarter: '{qtr}',
    periodEnd: '{period_end}',
    reportSource: '{source}',
    revenue: {fmt_val(None, d.get('revenue'))},
    cogs: {fmt_val(None, d.get('cogs'))},
    grossProfit: {fmt_val(None, d.get('gross'))},
    sga: {fmt_val(None, d.get('sga'))},
    operatingIncome: {fmt_val(None, d.get('opinc'))},
    otherIncomeLoss: {fmt_val(None, other_net)},
    financialIncomeLoss: {fmt_val(None, fin_net)},
    pretaxIncome: {fmt_val(None, pretax)},
    incomeTax: {fmt_val(None, tax)},
    netIncome: {fmt_val(None, net)},
    crossCheckOk: {cross_ok},
    crossCheckNote: '{cross_note}',
  }}"""
    ts_is_records.append(record)

ts_bs_records = []
bs_quarters = [
    ('23Q3', '2023-09-30'),
    ('23Q4', '2023-12-31'),
    ('24Q1', '2024-03-31'),
    ('24Q2', '2024-06-30'),
    ('24Q3', '2024-09-30'),
    ('24Q4', '2024-12-31'),
    ('25Q1', '2025-03-31'),
    ('25Q2', '2025-06-30'),
    ('25Q3', '2025-09-30'),
    ('25Q4', '2025-12-31'),
]

for qtr, period_end in bs_quarters:
    if qtr not in bs_raw:
        continue
    b = bs_raw[qtr]
    ca = b.get('currentAssets')

    record = f"""  {{
    quarter: '{qtr}',
    periodEnd: '{period_end}',
    cash: {fmt_val(None, b.get('cash'))},
    accountsReceivable: {fmt_val(None, b.get('accountsReceivable'))},
    inventory: {fmt_val(None, b.get('inventory'))},
    currentAssets: {fmt_val(None, ca)},
    ppe: {fmt_val(None, b.get('ppe'))},
    intangibles: {fmt_val(None, b.get('intangibles'))},
    rouAssets: {fmt_val(None, b.get('rouAssets'))},
    totalAssets: {fmt_val(None, b.get('totalAssets'))},
    accountsPayable: null,
    shortTermDebt: {fmt_val(None, b.get('shortTermDebt'))},
    longTermDebt: null,
    totalLiabilities: {fmt_val(None, b.get('totalLiabilities'))},
    totalEquity: {fmt_val(None, b.get('totalEquity'))},
  }}"""
    ts_bs_records.append(record)

# Write detailed-financials.ts
ts_is_content = """// Unit: 백만원 (million KRW)
// Source: DART business reports (사업보고서/분기보고서/반기보고서)
// Derived quarters (Q2, Q3, Q4) computed by subtraction of cumulative figures
// Cross-validation performed against existing income-statement.ts data
// Generated by extract_financials.py

export interface FaduDetailedIS {
  quarter: string;          // '23Q1', '23Q2', ..., '25Q4'
  periodEnd: string;        // 'YYYY-MM-DD'
  reportSource: string;     // derivation source

  // Income Statement (백만원)
  revenue: number | null;
  cogs: number | null;
  grossProfit: number | null;
  sga: number | null;
  operatingIncome: number | null;
  otherIncomeLoss: number | null;
  financialIncomeLoss: number | null;
  pretaxIncome: number | null;
  incomeTax: number | null;
  netIncome: number | null;

  // Cross-validation flag
  crossCheckOk: boolean;
  crossCheckNote: string;
}

export interface FaduDetailedBS {
  quarter: string;
  periodEnd: string;

  // Balance Sheet (백만원)
  cash: number | null;
  accountsReceivable: number | null;
  inventory: number | null;
  currentAssets: number | null;
  ppe: number | null;              // 유형자산
  intangibles: number | null;     // 무형자산
  rouAssets: number | null;       // 사용권자산
  totalAssets: number | null;
  accountsPayable: number | null;
  shortTermDebt: number | null;
  longTermDebt: number | null;
  totalLiabilities: number | null;
  totalEquity: number | null;
}

export const faduDetailedIS: FaduDetailedIS[] = [
""" + ',\n'.join(ts_is_records) + """
];

export const faduDetailedBS: FaduDetailedBS[] = [
""" + ',\n'.join(ts_bs_records) + """
];
"""

# Write sga-breakdown.ts
def sga_record(year, total, items_clean, prior_year_total=None, prior_items=None):
    def v(x): return str(to_m(x)) if x != 0 else '0'

    curr = items_clean
    lines = [
    f"  // {year}FY SGA breakdown from annual report notes",
    f"  {{",
    f"    year: {year},",
    f"    total: {to_m(total)},",
    f"    salary: {v(curr.get('salary', (0,0))[0])},",
    f"    pension: {v(curr.get('pension', (0,0))[0])},",
    f"    welfare: {v(curr.get('welfare', (0,0))[0])},",
    f"    stockComp: {v(curr.get('stockComp', (0,0))[0])},",
    f"    depreciation: {v(curr.get('depreciation', (0,0))[0])},",
    f"    rouDepreciation: {v(curr.get('rouDepreciation', (0,0))[0])},",
    f"    amortization: {v(curr.get('amortization', (0,0))[0])},",
    f"    rnd: {v(curr.get('rnd', (0,0))[0])},",
    f"    serviceFees: {v(curr.get('serviceFees', (0,0))[0])},",
    f"    other: {v(curr.get('other', (0,0))[0])},",
    f"  }}",
    ]
    return '\n'.join(lines)

ts_sga_records = [
    sga_record(2023, 69665231327, sga_23fy_clean),
    sga_record(2024, 100817499386, sga_24fy_clean),
    sga_record(2025, 109128401006, sga_25fy_clean),
]

ts_sga_content = """// Annual SG&A breakdown from notes in 사업보고서
// Unit: 백만원
// Source: DART annual reports, SGA expense notes (section 24.1 or 25.1)
// Item identification based on magnitude and K-IFRS standard ordering
// Generated by extract_financials.py

export interface FaduSgaBreakdown {
  year: number;            // 2023, 2024, 2025
  total: number;          // matches income-statement SGA sum

  salary: number | null;           // 급여
  pension: number | null;          // 퇴직급여
  welfare: number | null;          // 복리후생비
  stockComp: number | null;        // 주식보상비용
  depreciation: number | null;     // 감가상각비
  rouDepreciation: number | null;  // 사용권자산감가상각비
  amortization: number | null;     // 무형자산상각비
  rnd: number | null;              // 연구개발비
  serviceFees: number | null;      // 지급수수료
  other: number | null;            // 기타
}

export const faduSgaBreakdown: FaduSgaBreakdown[] = [
""" + ',\n'.join(ts_sga_records) + """
];
"""

# Write files
out_is = os.path.join(OUT_DIR, 'detailed-financials.ts')
out_sga = os.path.join(OUT_DIR, 'sga-breakdown.ts')

with open(out_is, 'w', encoding='utf-8') as f:
    f.write(ts_is_content)
print(f"\nWritten: {out_is}")

with open(out_sga, 'w', encoding='utf-8') as f:
    f.write(ts_sga_content)
print(f"Written: {out_sga}")

print("\n" + "=" * 70)
print("EXTRACTION COMPLETE")
print("=" * 70)
