{ nixpkgs ? <nixpkgs>
, systems ? [ "i686-linux" "x86_64-linux" "x86_64-darwin" ]
, officialRelease ? false
}:

let
  pkgs = import nixpkgs {};

  version = (builtins.fromJSON (builtins.readFile ./package.json)).version;

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
      }).package.override {
        postInstall = ''
          mkdir -p $out/share/doc/prom2cb
          $out/lib/node_modules/prom2cb/node_modules/jsdoc/jsdoc.js -R README.md -r lib -d $out/share/doc/prom2cb/apidox
          mkdir -p $out/nix-support
          echo "doc api $out/share/doc/prom2cb/apidox" >> $out/nix-support/hydra-build-products
        '';
      }
    );

    release = pkgs.releaseTools.aggregate {
      name = "prom2cb-${version}";
      constituents = [
        tarball
      ]
      ++ map (system: builtins.getAttr system package) systems;

      meta.description = "Release-critical builds";
    };
  };
in
jobs
