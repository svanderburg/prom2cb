{nodeEnv, fetchurl, fetchgit}:

let
  sources = {};
  args = {
    name = "prom2cb";
    packageName = "prom2cb";
    version = "0.0.2";
    src = ./.;
    meta = {
      description = "";
      license = "MIT";
    };
    production = true;
  };
in
{
  tarball = nodeEnv.buildNodeSourceDist args;
  package = nodeEnv.buildNodePackage args;
  shell = nodeEnv.buildNodeShell args;
}