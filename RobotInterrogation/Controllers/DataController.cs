using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RobotInterrogation.Models;

namespace RobotInterrogation.Controllers
{
    [Route("api/[controller]")]
    public class DataController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<Packet> ListPackets()
        {
            // TODO: can these be stored in a config file?
            throw new NotImplementedException();
        }
    }
}
