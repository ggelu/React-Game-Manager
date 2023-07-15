using System.Data;
using System.Data.SqlClient;

namespace ColocviuDAW
{
    public static class Globale
    {
        static string sqlDataSource, cerere;
        static DataTable tabel;
        static SqlDataReader reader;

        public static string sqlDataSourceGetSet
        {
            set { sqlDataSource = value; }
            get { return sqlDataSource; }
        }

        public static string cerereGetSet
        {
            set { cerere = value; }
            get { return cerere; }
        }

        public static DataTable tabelGetSet
        {
            set { tabel = value; }
            get { return tabel; }
        }

        public static SqlDataReader myReaderGetSet
        {
            set { reader = value; }
            get { return reader; }
        }
    }
}
