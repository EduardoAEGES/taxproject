-- Execute this in the Supabase SQL Editor
CREATE TABLE public.buecont (
    ruc VARCHAR(20) PRIMARY KEY,
    nombre_razon TEXT,
    a_partir_del DATE,
    resolucion VARCHAR(50)
);

-- After running this, go to Table Editor > buecont > Insert > Import data from CSV 
-- Upload the `BueCont_clean.csv` file we generated.
