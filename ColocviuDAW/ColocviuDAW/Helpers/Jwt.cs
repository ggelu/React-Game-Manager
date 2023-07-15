using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace ColocviuDAW.Helpers
{
    public class Jwt
    {
        private string cheieSecret = "Cheie extrem de foarte securizata";

        public string Genereaza(int id)
        {
            var cheieSimetrica = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(cheieSecret));
            var credentiale = new SigningCredentials(cheieSimetrica, SecurityAlgorithms.HmacSha256Signature);
            var header = new JwtHeader(credentiale);

            var continut = new JwtPayload(id.ToString(), null, null, null, DateTime.Today.AddDays(3650));
            var securityToken = new JwtSecurityToken(header, continut);

            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }

        public JwtSecurityToken Verifica(string jwt)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var cheie = Encoding.ASCII.GetBytes(cheieSecret);
            tokenHandler.ValidateToken(jwt, new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(cheie),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = false,
                ValidateAudience = false
            }, out SecurityToken tokenValidat);

            return (JwtSecurityToken)tokenValidat;
        }
    }
}
