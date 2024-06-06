import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { capital, nonCapital, oilPrice, taxRate, years } = req.body;
        console.log(capital, nonCapital, oilPrice, taxRate, years)
      // Hitung depresiasi
      const di = capital / 10;
  
      // Simpan investasi dan operasional
      const { data: investasi, error: investasiError } = await supabase
        .from('investasi')
        .insert([{ capital, non_capital: nonCapital }])
        .select();

        if (investasiError) throw investasiError;
        
        const { data : operasional, error: operasionalError } = await supabase
        .from('operasional')
        .insert([{ opex: years[0].opex, tax_rate: taxRate, oil_price: oilPrice }])
        .select();
        
        if (operasionalError) throw operasionalError;

      // Hitung dan simpan produksi tiap tahun
      for (const year of years) {
        const income = year.produksi * oilPrice;
        const taxable_income = income - year.opex - di;
        const tax = taxable_income * taxRate;
        const ncf = taxable_income - tax;
  
        const { error : produksiError } = await supabase
          .from('produksi')
          .insert([{
            tahun: year.year,
            produksi: year.produksi,
            income,
            opex: year.opex,
            di,
            taxable_income,
            tax,
            ncf,
            investasi_id: investasi[0].id,
            operasional_id: operasional[0].id
          }]);
          if (produksiError) throw produksiError;
          console.log("produksi:",produksiError )
      }
      
      res.status(200).json({ message: 'Data berhasil disimpan dan dihitung' });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }