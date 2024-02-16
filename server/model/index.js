const {createClient} = require("@supabase/supabase-js");
const supabase = createClient(process.env.PROJECT_URL,process.env.API_KEY);

//exporting the module
module.exports = supabase