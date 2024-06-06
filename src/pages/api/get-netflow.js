import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data: calculations, error } = await supabase
            .from('investasi')
            .select(`
                id,
                capital,
                non_capital,
                produksi (
                    tahun,
                    produksi,
                    income,
                    opex,
                    di,
                    taxable_income,
                    tax,
                    ncf,
                    operasional (*)
                )
            `);

        if (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }

        res.status(200).json(calculations);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
