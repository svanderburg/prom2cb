{ nixpkgs ? <nixpkgs>
, systems ? [ "i686-linux" "x86_64-linux" "x86_64-darwin" ]
, officialRelease ? false
}:

let
  pkgs = import nixpkgs {};
  
  version = (builtins.fromJSON ./package.json).version;
  
  jobset = import ./default.nix {
    inherit pkgs;
    system = builtins.currentSystem;
  };
  
  jobs = rec {
    inherit (jobset) tarball;
  
    package = pkgs.lib.genAttrs systems (system:
      (import ./default.nix {
        pkgs = import nixpkgs { inherit system; };
        inherit system;
      }).package
    );
  };
in
jobs
